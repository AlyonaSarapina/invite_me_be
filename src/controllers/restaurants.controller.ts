import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RestaurantsService } from 'src/services/restaurants.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getRestaurants(@Req() req: Request) {
    const user = req.user as { id: number; role: string };

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.restaurantsService.getRestaurantsByRole(user);
  }
}
