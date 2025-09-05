/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}
