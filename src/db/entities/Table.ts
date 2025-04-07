import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { Booking } from "./Booking";

@Entity({ schema: "restautants" })
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_number: number;

  @Column()
  table_capacity: number;

  @CreateDateColumn({ type: "time with time zone" })
  created_at: Date;

  @UpdateDateColumn({ type: "time with time zone" })
  updated_at: Date;

  @DeleteDateColumn({ type: "time with time zone", nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @JoinColumn({ name: "restaurant_id" })
  @Index()
  restautant: Restaurant;

  @ManyToMany(() => Booking, (booking) => booking.tables)
  bookings: Booking[];
}
