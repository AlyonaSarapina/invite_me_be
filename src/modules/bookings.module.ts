import { Module } from '@nestjs/common';
import { BookingsController } from '../controllers/bookings.controller';
import { BookingsService } from '../services/bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/db/entities/booking.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { Table } from 'src/db/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Restaurant, Table])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
