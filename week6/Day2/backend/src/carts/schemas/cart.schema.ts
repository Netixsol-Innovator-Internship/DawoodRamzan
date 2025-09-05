/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  size: string;

  @Prop({})
  point: number;

  @Prop({ required: true })
  image: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: Types.DocumentArray<CartItemDocument>;

  @Prop({ default: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
