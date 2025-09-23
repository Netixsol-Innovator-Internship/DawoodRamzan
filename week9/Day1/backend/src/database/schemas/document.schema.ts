import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ResearchDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  source?: string;

  @Prop()
  author?: string;
}

export const ResearchDocumentSchema =
  SchemaFactory.createForClass(ResearchDocument);
