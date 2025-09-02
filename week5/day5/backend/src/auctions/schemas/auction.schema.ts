import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Car } from '../../cars/schemas/car.schema';
import { Bid } from '../../bids/schemas/bid.schema';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Car', required: true })
  car: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 'active' })
  status: string; // active, completed, expired

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bid' })
  currentBid: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Bid' }] })
  bids: MongooseSchema.Types.ObjectId[];

  @Prop({ default: 0 })
  bidCount: number;

  @Prop({ default: 100 })
  startingPrice: number;

  @Prop({ default: 100 })
  bidIncrement: number;

  @Prop({ default: 1000 })
  maxBid: number;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
