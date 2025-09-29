/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ type: [Object], default: [] })
  mongoQueries: any[];

  @Prop({ type: [Object], default: [] })
  mongoResponse: any[];

  @Prop({ default: '' })
  summary: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
