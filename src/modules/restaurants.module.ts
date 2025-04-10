import { Module } from '@nestjs/common';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/Restaurant';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), JwtModule, PassportModule, AuthModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantModule {}
