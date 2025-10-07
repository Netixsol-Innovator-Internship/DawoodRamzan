/* eslint-disable */
// src/schemas/assignment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema()
export class Assignment {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  wordCount: number;

  @Prop({ default: 'strict' })
  evaluationMode: 'strict' | 'loose';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);