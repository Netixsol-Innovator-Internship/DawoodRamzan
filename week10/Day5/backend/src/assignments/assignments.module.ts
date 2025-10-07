/* eslint-disable */
// src/assignment/assignment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentController } from './assignments.controller';
import { AssignmentService } from './assignments.service';
import { Assignment, AssignmentSchema } from '../schemas/assignment.schema';
import { Submission, SubmissionSchema } from '../schemas/submission.schema';
import { AiEvaluationService } from '../evaluation/ai-evaluation.service';
import { PdfProcessingService } from '../evaluation/pdf-processing.service';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    AiEvaluationService,
    PdfProcessingService,
    FileUploadService,
  ],
})
export class AssignmentModule {}
