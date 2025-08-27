/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop({ type: [Types.ObjectId], ref: 'Comment', default: [] })
  replies: Types.ObjectId[];
  @Prop({ type: [String], default: [] })
  likes: string[]; // user ids who liked
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
