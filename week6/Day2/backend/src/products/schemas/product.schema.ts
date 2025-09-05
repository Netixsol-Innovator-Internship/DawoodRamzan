/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  [x: string]: any;
  @Prop({ required: true })
  name: string;

  @Prop({ default: 4 })
  rating: number;

  @Prop({ required: false })
  price: number;

  @Prop({ default: 0 })
  salePrice: number;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ required: true })
  brand: string;

  @Prop({ default: 12345 })
  promo: number;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  point: number;

  @Prop({
    type: [String],
    default: [
      'https://res.cloudinary.com/dusclm57c/image/upload/v1756983373/SLEEVE_STRIPED_T-SHIRT_vfxwma.png',
    ],
  })
  images: string[];

  @Prop({
    required: true,
    enum: ['T-shirts', 'Shorts', 'Shirts', 'Hoods', 'Jeans'],
  })
  category: string;

  @Prop({
    enum: ['White', 'Blue', 'Green', 'Red', 'Black', 'Grey', 'Brown'],
  })
  color: string;

  @Prop([
    {
      type: String,
      enum: [
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
    },
  ])
  sizes: string[];

  @Prop({
    required: true,
    enum: ['Casual', 'Formal', 'Party', 'Gym'],
  })
  dressStyle: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
