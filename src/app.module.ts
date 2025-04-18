import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './db/entities/table.entity';
import { User } from './db/entities/user.entity';
import { Restaurant } from './db/entities/restaurant.entity';
import { Booking } from './db/entities/booking.entity';
import { AuthModule } from './modules/auth.module';
import { RestaurantModule } from './modules/restaurants.module';
import { UsersModule } from './modules/users.module';
import { TablesModule } from './modules/tables.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType, appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { CloudinaryModule } from './modules/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import { cloudinaryConfig } from './config/cloudinary.config';
import { BookingsModule } from './modules/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig, authConfig, cloudinaryConfig],
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
    MulterModule.register(multerConfig),
    AuthModule,
    RestaurantModule,
    UsersModule,
    TablesModule,
    CloudinaryModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
