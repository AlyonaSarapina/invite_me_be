import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/db/entities/table.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { TablesService } from 'src/services/tables.service';
import { TablesController } from 'src/controllers/tables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Restaurant])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
