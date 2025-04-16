import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Booking } from './booking.entity';

@Entity({ schema: 'restaurants' })
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_number: number;

  @Column()
  table_capacity: number;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'time with time zone', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @JoinColumn({ name: 'restaurant_id' })
  @Index()
  restaurant: Restaurant;

  @OneToMany(() => Booking, (booking) => booking.table)
  bookings: Booking[];
}
