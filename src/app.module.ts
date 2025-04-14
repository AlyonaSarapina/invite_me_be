import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './db/entities/Table';
import { User } from './db/entities/User';
import { Restaurant } from './db/entities/Restaurant';
import { Booking } from './db/entities/Booking';
import { AuthModule } from './modules/auth.module';
import { RestaurantModule } from './modules/restaurants.module';
import { UsersModule } from './modules/users.module';
import { TablesModule } from './modules/tables.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType, appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        ...configService.get('database'),
        entities: [User, Restaurant, Table, Booking],
      }),
    }),
    AuthModule,
    RestaurantModule,
    UsersModule,
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
