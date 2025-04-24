import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { BookingStatus } from 'src/db/entities/booking.entity';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  num_people: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;
}

export class UpdateBookingStatusDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
