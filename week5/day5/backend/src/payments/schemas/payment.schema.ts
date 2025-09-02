import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Auction } from '../../auctions/schemas/auction.schema';
import { User } from '../../users/schemas/user.schema';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Auction', required: true })
  auction: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentMethod: string; // credit_card, paypal, etc.

  @Prop({ required: true, default: 'pending' })
  status: string; // pending, completed, failed

  @Prop()
  transactionId: string;

  @Prop()
  shippingAddress: string;

  @Prop({ default: 'pending' })
  shippingStatus: string; // pending, ready, in_transit, delivered
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
