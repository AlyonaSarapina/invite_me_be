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
import { User } from './User';
import { Table } from './Table';

@Entity({ schema: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'json' })
  operating_hours: JSON;

  @Column()
  booking_duration: number;

  @Column()
  tables_capacity: number;

  @Column()
  cuisine: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  menu_url: string;

  @Column()
  phone: string;

  @Column()
  inst_url: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;

  @Column()
  is_pet_friedly: boolean;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'time with time zone', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'owner_id' })
  @Index()
  owner: User;

  @OneToMany(() => Table, (table) => table.restaurant)
  tables: Table[];
}
