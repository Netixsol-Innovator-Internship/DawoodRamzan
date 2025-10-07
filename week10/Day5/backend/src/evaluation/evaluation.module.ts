// src/evaluation/evaluation.module.ts
import { Module } from '@nestjs/common';
import { AiEvaluationService } from './ai-evaluation.service';
import { PdfProcessingService } from './pdf-processing.service';

@Module({
  providers: [AiEvaluationService, PdfProcessingService],
  exports: [AiEvaluationService, PdfProcessingService],
})
export class EvaluationModule {}
