import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsNumber()
  @IsOptional()
  currentPrice?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];
}
