/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PDFDocument, PDFDocumentSchema } from './schema/document.schema';
import { GeminiService } from '../gemini.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PDFDocument.name, schema: PDFDocumentSchema },
    ]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService, GeminiService],
})
export class DocumentModule {}
