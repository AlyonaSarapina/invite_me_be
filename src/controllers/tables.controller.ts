import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/db/entities/User';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateTableDto, UpdateTableDto } from 'src/dto/table.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { TablesService } from 'src/services/tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get('restaurant/:restaurantId')
  getTablesByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number, @CurrentUser() user: User) {
    return this.tablesService.getTablesByRestaurant(restaurantId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post()
  createTable(@Body() createTableDto: CreateTableDto, @CurrentUser() user: User) {
    return this.tablesService.create(createTableDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Patch(':id')
  updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableDto: UpdateTableDto,
    @CurrentUser() user: User,
  ) {
    return this.tablesService.update(id, updateTableDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Delete(':id')
  deleteTable(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.tablesService.delete(id, user);
  }
}
