/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsMongoId, IsNumber, Min, IsString } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  size: string;
}
