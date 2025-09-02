import { Type } from 'class-transformer';
import { IsDate, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  car: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @Type(() => Date) // 👈 This is where it belongs
  @IsNotEmpty()
  startTime: Date;

  @IsDate()
  @Type(() => Date) // 👈 This is where it belongs
  @IsNotEmpty()
  endTime: Date;

  @IsString()
  @IsOptional()
  currentBid?: string;
}
