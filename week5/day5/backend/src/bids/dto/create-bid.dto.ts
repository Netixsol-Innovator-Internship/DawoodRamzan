import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateBidDto {
  @IsString()
  @IsNotEmpty()
  auction: string;

  @IsString()
  @IsNotEmpty()
  bidder: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  // @IsString()
  // status: string;
}
