import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Table } from "./Table";
import { User } from "./User";

export type BookingStatus = "confirmed" | "canceled" | "completed";

@Entity({ schema: "bookings" })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  num_people: number;

  @Column({ type: "timestamp with time zone" })
  start_time: Date;

  @Column({ type: "timestamp with time zone" })
  end_time: Date;

  @Column({ type: "enum", enum: ["confirmed", "canceled", "completed"] })
  status: BookingStatus;

  @CreateDateColumn({ type: "time with time zone" })
  created_at: Date;

  @UpdateDateColumn({ type: "time with time zone" })
  updated_at: Date;

  @DeleteDateColumn({ type: "time with time zone", nullable: true })
  deleted_at: Date;

  @ManyToMany(() => Table, (table) => table.bookings)
  @JoinColumn({ name: "table_id" })
  tables: Table[];

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "client_id" })
  client: User;
}
