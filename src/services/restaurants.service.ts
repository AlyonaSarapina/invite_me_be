import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateRestaurantDto, UpdateRestaurantDto } from 'src/dto/restaurant.dto';
import { FindOptionsWhere, ILike, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { GetRestaurantsQueryDto } from 'src/dto/getRestaurantQuery.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAll(getRestaurantQueryDto: GetRestaurantsQueryDto): Promise<[Restaurant[], number]> {
    const { limit = 10, offset = 0, name, min_rating, cuisine, is_pet_friedly } = getRestaurantQueryDto;

    const where: FindOptionsWhere<Restaurant> = {
      deleted_at: IsNull(),
    };

    if (min_rating !== undefined) {
      where.rating = MoreThanOrEqual(min_rating);
    }

    if (cuisine) {
      where.cuisine = ILike(cuisine);
    }

    if (is_pet_friedly) {
      where.is_pet_friedly = is_pet_friedly;
    }

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    return await this.restaurantRepo.findAndCount({
      where,
      skip: offset,
      take: limit,
    });
  }

  async getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]> {
    return await this.restaurantRepo.find({
      where: {
        deleted_at: IsNull(),
        owner: { id: ownerId },
      },
    });
  }

  async getRestaurantById(id: number, ownerId: number): Promise<Restaurant | null> {
    return await this.restaurantRepo.findOneOrFail({
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

  async uploadFile(id: number, file: Express.Multer.File, type: 'logo' | 'menu', user: User): Promise<Restaurant> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

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

    let publicId: string;

    const result = await this.cloudinaryService.uploadFile(file, `${type}s`);

    if (type === 'logo') {
      publicId = this.cloudinaryService.extractPublicId(restaurant.logo_url);
      await this.cloudinaryService.deleteFile(publicId);
      restaurant.logo_url = result.secure_url;
    } else if (type === 'menu') {
      publicId = this.cloudinaryService.extractPublicId(restaurant.menu_url);
      restaurant.menu_url = result.secure_url;
      await this.cloudinaryService.deleteFile(restaurant.menu_url);
    } else {
      throw new BadRequestException('Invalid file type');
    }

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

    await this.restaurantRepo.softRemove(restaurant);

    return restaurant;
  }
}
