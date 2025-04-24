import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { Table } from 'src/db/entities/table.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateTableDto, UpdateTableDto } from 'src/dto/table.dto';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}

  async getTablesByRestaurant(restaurantId: number, ownerId: number): Promise<Table[]> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId, deleted_at: IsNull(), owner: { id: ownerId } },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found or access denied');
    }

    return await this.tableRepo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant'],
    });
  }

  async create(dto: CreateTableDto, owner: User): Promise<Table> {
    const restaurant = await this.restaurantRepo.findOne({
      where: {
        id: dto.restaurant_id,
        deleted_at: IsNull(),
        owner: {
          id: owner.id,
        },
      },
      relations: ['tables'],
    });

    if (!restaurant || restaurant.owner.id !== owner.id) {
      throw new NotFoundException('Restaurant not found or access denied');
    }

    const currentTableCount = await this.tableRepo.find({
      where: {
        restaurant: {
          id: restaurant.id,
          deleted_at: IsNull(),
        },
      },
    });

    if (currentTableCount.length >= restaurant.tables_capacity) {
      throw new BadRequestException(
        `This restaurant already has the maximum allowed number of tables (${restaurant.tables_capacity}). To add a table please remove one of the existing tables first`,
      );
    }

    const table = this.tableRepo.create({
      ...dto,
      restaurant,
    });

    return await this.tableRepo.save(table);
  }

  async update(id: number, dto: UpdateTableDto, owner: User): Promise<Table> {
    const table = await this.tableRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
      relations: ['restaurant.owner'],
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (table.restaurant.owner.id !== owner.id) {
      throw new ForbiddenException('You are not allowed to update this table');
    }

    Object.assign(table, dto);
    return await this.tableRepo.save(table);
  }

  async delete(id: number, owner: User): Promise<Table> {
    const table = await this.tableRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
      relations: ['restaurant.owner'],
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (table.restaurant.owner.id !== owner.id) {
      throw new ForbiddenException('You are not allowed to delete this table');
    }

    await this.tableRepo.softRemove(table);
    return table;
  }
}
