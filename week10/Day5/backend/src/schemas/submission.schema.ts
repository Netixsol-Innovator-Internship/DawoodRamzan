/* eslint-disable */

// src/schemas/submission.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema()
export class Submission {
  @Prop({ required: true })
  assignmentId: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  rollNumber: string;

  @Prop()
  fileName: string;

  @Prop()
  filePath: string;

  @Prop()
  extractedText: string;

  @Prop()
  wordCount: number;

  @Prop()
  score: number;

  @Prop()
  remarks: string;

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop({ default: 'pending' })
  status: 'pending' | 'processed' | 'error';
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);