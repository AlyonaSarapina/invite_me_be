import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from 'src/db/entities/booking.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { Table } from 'src/db/entities/table.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateBookingDto, UpdateBookingStatusDto } from 'src/dto/booking.dto';
import { In, IsNull, LessThan, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,

    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
  ) {}

  async getAllBookings(user: User): Promise<Booking[]> {
    if (user.role === 'client') {
      return this.bookingRepo.find({
        where: { client: { id: user.id }, deleted_at: IsNull() },
        relations: ['table', 'client'],
      });
    }

    if (user.role === 'owner') {
      const ownerRestaurants = await this.restaurantRepo.find({
        where: { owner: { id: user.id }, deleted_at: IsNull() },
        relations: ['tables'],
      });

      const tableIds = ownerRestaurants
        .flatMap((restaurant: Restaurant) => restaurant.tables)
        .map((table: Table) => table.id);

      if (!tableIds.length) return [];

      return this.bookingRepo.find({
        where: {
          table: In(tableIds),
          deleted_at: IsNull(),
        },
        relations: ['table', 'client'],
      });
    }

    throw new ForbiddenException('Invalid role');
  }

  async createBooking(restaurantId: number, createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const { num_people, start_time, end_time } = createBookingDto;
    const start_date = new Date(start_time);
    const end_date = new Date(end_time);

    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId, deleted_at: IsNull() },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === 'owner' && restaurant.owner.id !== user.id) {
      throw new ForbiddenException('You cannot book for a restaurant you do not own');
    }

    const table = await this.findAvailableTable(restaurantId, start_date, end_date, num_people);

    if (!table) {
      throw new NotFoundException('No free table at the selected time');
    }

    const booking = this.bookingRepo.create({
      num_people,
      start_time,
      end_time,
      status: BookingStatus.CONFIRMED,
      client: user,
      table,
    });

    return await this.bookingRepo.save(booking);
  }

  async findAvailableTable(
    restaurantId: number,
    startTime: Date,
    endTime: Date,
    numPeople: number,
    excludeBookingId?: number,
  ): Promise<Table> {
    const tables = await this.tableRepo.find({
      where: {
        restaurant: { id: restaurantId },
        table_capacity: MoreThanOrEqual(numPeople),
        deleted_at: IsNull(),
      },
      relations: ['bookings'],
      order: { table_capacity: 'ASC' },
    });

    const bookingPromises = tables.map((table) => {
      return this.bookingRepo.find({
        where: {
          table: { id: table.id },
          status: BookingStatus.CONFIRMED,
          start_time: LessThan(endTime),
          end_time: MoreThan(startTime),
          ...(excludeBookingId && { id: Not(excludeBookingId) }),
        },
      });
    });

    const bookingResults = await Promise.all(bookingPromises);

    const availableTable = tables.find((_, index) => bookingResults[index].length === 0);

    if (!availableTable) {
      throw new NotFoundException('No free table at the selected time');
    }

    return availableTable;
  }

  async updateBooking(id: number, updateBookingStatusDto: UpdateBookingStatusDto, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['table', 'client', 'table.restaurant', 'table.restaurant.owner'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role === 'client' && booking.client.id !== user.id) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    if (user.role === 'owner' && booking.table.restaurant.owner.id !== user.id) {
      throw new ForbiddenException('You can only update bookings in your own restaurants');
    }

    const { num_people, start_time, end_time, status } = updateBookingStatusDto;

    const isTimeUpdated = start_time && end_time;
    const isPeopleUpdated = num_people && num_people !== booking.num_people;

    if (status !== undefined) {
      booking.status = status;
    }

    if (isTimeUpdated || isPeopleUpdated) {
      const new_start_time = start_time ? new Date(start_time) : booking.start_time;
      const new_end_time = end_time ? new Date(end_time) : booking.end_time;
      const new_people = num_people ?? booking.num_people;

      const availableTable = await this.findAvailableTable(
        booking.table.restaurant.id,
        new_start_time,
        new_end_time,
        new_people,
        booking.id,
      );

      if (!availableTable) {
        throw new ConflictException('No available tables for the updated time and group size');
      }

      booking.table = availableTable;
      booking.start_time = new_start_time;
      booking.end_time = new_end_time;
      booking.num_people = new_people;
    }

    return await this.bookingRepo.save(booking);
  }

  async cancelBooking(id: number, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      withDeleted: false,
      relations: ['client'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.client.id !== user.id) {
      throw new ForbiddenException('You are not allowed to cancel this booking');
    }

    booking.status = BookingStatus.CANCELED;

    const deletedBooking = await this.bookingRepo.save(booking);

    await this.bookingRepo.softRemove(booking);

    return deletedBooking;
  }
}
