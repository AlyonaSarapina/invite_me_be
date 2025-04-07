import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Restaurant } from './Restaurant';
import { Booking } from './Booking';

export type UserRoleType = 'client' | 'owner';

@Entity({ schema: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  profile_pic_url: string;

  @Column({ type: 'enum', enum: ['client', 'owner'] })
  role: UserRoleType;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'time with time zone', nullable: true })
  deleted_at: Date;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @OneToMany(() => Booking, (booking) => booking.client)
  bookings: Booking[];
}
