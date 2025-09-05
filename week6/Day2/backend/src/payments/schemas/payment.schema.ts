import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ 
    required: true, 
    enum: PaymentStatus,
    default: PaymentStatus.PENDING 
  })
  status: PaymentStatus;

  @Prop()
  transactionId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);