import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  point: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsString()
  color: string;

  @IsString()
  brand: string;

  @IsNumber()
  @IsOptional()
  promo: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  @IsEnum(['T-shirts', 'Shorts', 'Shirts', 'Hoods', 'Jeans'])
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsEnum(
    [
      'xx-small',
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large',
      '3x-large',
      '4x-large',
    ],
    { each: true },
  )
  sizes: string[];

  @IsString()
  @IsEnum(['Casual', 'Formal', 'Party', 'Gym'])
  dressStyle: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
