import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SubQuestion extends Document {
  @Prop({ required: true })
  question: string;

  @Prop()
  documents?: string[];
}

export const SubQuestionSchema = SchemaFactory.createForClass(SubQuestion);

@Schema()
export class ResearchQuery extends Document {
  @Prop({ required: true })
  originalQuestion: string;

  @Prop({ type: [SubQuestionSchema] })
  subQuestions: SubQuestion[];

  @Prop()
  finalAnswer?: string;

  @Prop()
  contradictions?: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Object })
  trace: any;
}

export const ResearchQuerySchema = SchemaFactory.createForClass(ResearchQuery);
