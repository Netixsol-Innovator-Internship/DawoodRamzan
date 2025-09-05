/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
