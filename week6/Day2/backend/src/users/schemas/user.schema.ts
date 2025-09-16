import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ default: 'customer' })
  role: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'local' })
  provider: string;

  @Prop({})
  providerId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
