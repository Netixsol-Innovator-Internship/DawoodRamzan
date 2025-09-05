/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem } from '../../carts/schemas/cart.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
