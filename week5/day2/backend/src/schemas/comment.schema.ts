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

  // NEW: who this comment replies to (null/undefined for top-level)
  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentId?: Types.ObjectId | null;

  // List of direct replies (ObjectId references to Comment documents)
  @Prop({ type: [Types.ObjectId], ref: 'Comment', default: [] })
  replies: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  likes: string[]; // user ids who liked
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Helpful indexes
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ parentId: 1, createdAt: -1 });
