/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Auction } from '../../auctions/schemas/auction.schema';
import { User } from '../../users/schemas/user.schema';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Auction', required: true })
  auction: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  bidder: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  // @Prop({ default: 'pending' })
  // status: string; // pending, accepted, rejected
}

export const BidSchema = SchemaFactory.createForClass(Bid);
