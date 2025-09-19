/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PDFDocument extends Document {
  @Prop() filename: string;
  @Prop() summary: string;
  @Prop() category: string;
  @Prop([String]) highlights: string[];
  @Prop([[Number]]) embeddings: number[][];
}

export const PDFDocumentSchema = SchemaFactory.createForClass(PDFDocument);
