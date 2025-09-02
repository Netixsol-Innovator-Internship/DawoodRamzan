import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionDto } from './create-auction.dto';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @Type(() => Date) // 👈 This is where it belongs
  @IsOptional()
  endTime?: Date;

  @IsString()
  @IsOptional()
  currentBid?: string;
}
