import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/Restaurant';
import { User } from 'src/db/entities/User';
import { CreateRestaurantDto, UpdateRestaurantDto } from 'src/dto/restaurant.dto';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  async getAll(): Promise<Restaurant[]> {
    return this.restaurantRepo.find({
      where: {
        deleted_at: IsNull(),
      },
    });
  }

  async getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]> {
    return this.restaurantRepo.find({
      where: {
        deleted_at: IsNull(),
        owner: { id: ownerId },
      },
    });
  }

  async getRestaurantById(id: number, ownerId: number) {
    return this.restaurantRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        owner: {
          id: ownerId,
        },
      },
    });
  }

  async create(dto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = this.restaurantRepo.create({
      ...dto,
      owner,
    });
    return await this.restaurantRepo.save(restaurant);
  }

  async update(id: number, dto: UpdateRestaurantDto, user: User): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.owner.id !== user.id) {
      throw new ForbiddenException('You are not allowed to update this restaurant');
    }

    Object.assign(restaurant, dto);
    return await this.restaurantRepo.save(restaurant);
  }

  async delete(id: number, user: User): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.owner.id !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this restaurant');
    }

    await this.restaurantRepo.softDelete(id);

    return restaurant;
  }
}
