/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ResearchWorkflow } from './workflow/research-workflow';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchQuery } from './database/schemas/query.schema';
import { ResearchDocument } from './database/schemas/document.schema';
import { AskDto } from './DTOs/ask.dto';
import { UploadDto } from './DTOs/upload.dto';

@Controller()
export class ResearchController {
  constructor(
    private researchWorkflow: ResearchWorkflow,
    @InjectModel(ResearchQuery.name) private queryModel: Model<ResearchQuery>,
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocument>,
  ) {}

  @Post('/ask')
  async askQuestion(@Body() askDto: AskDto) {
    const result = await this.researchWorkflow.execute(askDto.question);

    // Save to database
    const queryRecord = new this.queryModel({
      originalQuestion: askDto.question,
      subQuestions: Object.keys(result.trace.steps[0].result).map((q) => ({
        question: q,
      })),
      finalAnswer: result.answer,
      contradictions: result.contradictions,
      trace: result.trace,
    });

    await queryRecord.save();

    return {
      answer: result.answer,
      traceId: queryRecord._id,
      contradictions: result.contradictions,
    };
  }

  @Post('/upload')
  async uploadDocument(@Body() uploadDto: UploadDto) {
    const document = new this.documentModel(uploadDto);
    await document.save();
    return { message: 'Document uploaded successfully', id: document._id };
  }

  @Get('/trace/:id')
  async getTrace(@Param('id') id: string) {
    const query = await this.queryModel.findById(id);
    if (!query) {
      return { error: 'Trace not found' };
    }
    return query.trace;
  }

  @Get('/documents')
  async getDocuments() {
    return this.documentModel.find().exec();
  }
}
