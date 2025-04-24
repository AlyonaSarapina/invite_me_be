import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateUser(id: number, updates: Partial<User>): Promise<Omit<User, 'password'>> {
    await this.userRepo.update(id, updates);
    const updatedUser = await this.userRepo.findOneBy({ id });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userInfo } = updatedUser;

    return userInfo;
  }

  async uploadFile(user: User, file: Express.Multer.File): Promise<Omit<User, 'password'>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const publicId = this.cloudinaryService.extractPublicId(user.profile_pic_url);

    await this.cloudinaryService.deleteFile(publicId);

    const result = await this.cloudinaryService.uploadFile(file, 'users');

    user.profile_pic_url = result.secure_url;

    await this.userRepo.save(user);

    const updatedUser = await this.userRepo.findOneBy({ id: user.id });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userInfo } = updatedUser;

    return userInfo;
  }

  async removeUser(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.softRemove(user);

    const { password, ...userInfo } = user;

    return userInfo;
  }
}
