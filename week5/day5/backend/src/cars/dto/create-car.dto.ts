import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsArray()
  @IsNotEmpty()
  photos: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  currentPrice: number;

  @IsNumber()
  @IsNotEmpty()
  reservePrice: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  owner?: string;
}
