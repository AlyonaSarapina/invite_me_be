import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RestaurantsService } from 'src/services/restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from 'src/dto/restaurant.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/db/entities/User';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  getAllRestaurants() {
    return this.restaurantsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get('my')
  getRestaurants(@CurrentUser() user: User) {
    return this.restaurantsService.getRestaurantsByOwner(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto, @CurrentUser() user: User) {
    return this.restaurantsService.create(createRestaurantDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Patch(':id')
  updateRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Delete(':id')
  deleteRestaurant(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.restaurantsService.delete(id, user);
  }
}
