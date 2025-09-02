import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Car' }] })
  myCars: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Bid' }] })
  myBids: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Car' }] })
  wishlist: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
// {
//   "firstName": "Dawood",
//   "lastName": "Ramzan",
//   "email": "dawood@example.com",
//   "password": "dawood772",
//     "phone": "+92-300-1234567"
// }
