import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  googleId: string;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop([{ type: String }])
  savedCVs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
