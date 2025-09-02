import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Tea', required: true })
  teaId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserTea', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  // NEW: who this review replies to (null/undefined for top-level)
  @Prop({ type: Types.ObjectId, ref: 'Review', default: null })
  parentId?: Types.ObjectId | null;

  // List of direct replies (ObjectId references to Comment documents)
  @Prop({ type: [Types.ObjectId], ref: 'Review', default: [] })
  replies: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  likes: string[]; // user ids who liked
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
