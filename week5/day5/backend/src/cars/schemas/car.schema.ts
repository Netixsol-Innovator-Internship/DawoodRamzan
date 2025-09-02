/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  mileage: number;

  @Prop({ required: true })
  vin: string;

  @Prop({ type: [String], required: true })
  photos: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 0 })
  currentPrice: number;

  @Prop({ required: true })
  reservePrice: number;

  @Prop({ required: true, default: 'active' })
  status: string; // active, sold, expired

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  auctionEnd: Date;

  @Prop({ required: true })
  maxBid: number;
}

export const CarSchema = SchemaFactory.createForClass(Car);
