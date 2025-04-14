import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTableDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  table_number: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  table_capacity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  restaurant_id: number;
}

export class UpdateTableDto extends PartialType(CreateTableDto) {}
