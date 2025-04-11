import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { Repository } from 'typeorm';
import { format } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

  async removeUser(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const timeWithTZ = format(now, 'HH:mm:ssXXX');

    user.deleted_at = timeWithTZ as unknown as Date;
    await this.userRepo.save(user);

    const { password, ...userInfo } = user;

    return userInfo;
  }
}
