// user-tea.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserTeaDocument = UserTea & Document;

@Schema({ timestamps: true })
export class UserTea {
  @Prop({
    type: String,
    required: true,
    sparse: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: String,
    enum: ['user', 'admin', 'super admin'],
    default: 'user',
  })
  role: string;

  @Prop({ type: Boolean, default: false })
  blocked: boolean;
}

export const UserTeaSchema = SchemaFactory.createForClass(UserTea);
