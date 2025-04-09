import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './db/entities/Table';
import { User } from './db/entities/User';
import { Restaurant } from './db/entities/Restaurant';
import { Booking } from './db/entities/Booking';
import 'dotenv';
import { configDotenv } from 'dotenv';

configDotenv();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Restaurant, Table, Booking],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
