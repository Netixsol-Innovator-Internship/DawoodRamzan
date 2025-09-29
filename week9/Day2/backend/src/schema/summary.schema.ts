/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Summary {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type SummaryDocument = Summary & Document;
export const SummarySchema = SchemaFactory.createForClass(Summary);
