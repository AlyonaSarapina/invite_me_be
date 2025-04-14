import { Module } from '@nestjs/common';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/Restaurant';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantModule {}
