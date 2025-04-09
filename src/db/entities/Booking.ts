import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Table } from './Table';
import { User } from './User';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Entity({ schema: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  num_people: number;

  @Column({ type: 'timestamp with time zone' })
  start_time: Date;

  @Column({ type: 'timestamp with time zone' })
  end_time: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'time with time zone', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Table, (table) => table.bookings)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'client_id' })
  client: User;
}
