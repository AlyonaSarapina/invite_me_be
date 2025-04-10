import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/Restaurant';
import { User, UserRole } from 'src/db/entities/User';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  async getRestaurantsByRole(user: { id: number; role: string }) {
    if (user.role === UserRole.OWNER) {
      return this.restaurantRepo.find({
        where: { owner: { id: user.id } },
        relations: ['owner'],
      });
    }

    return this.restaurantRepo.find({
      where: {
        deleted_at: IsNull(),
      },
    });
  }
}
