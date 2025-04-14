import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/db/entities/Table';
import { Restaurant } from 'src/db/entities/Restaurant';
import { TablesService } from 'src/services/tables.service';
import { TablesController } from 'src/controllers/tables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Restaurant])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
