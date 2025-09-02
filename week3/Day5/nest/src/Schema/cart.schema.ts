// cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { UserTea } from './User.schema';
import { Tea } from './tea.schema';

export type CartDocument = Cart & Document;

@Schema() // ✅ make it a proper subdocument schema
class CartItem {
  @Prop({ type: Types.ObjectId, ref: Tea.name, required: true })
  tea: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  quantity: number;
}
const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: UserTea.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
