/* eslint-disable*/
// src/assignment/assignment.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { AssignmentService } from './assignments.service';
import { CreateAssignmentDto } from '../dto/create-assignment.dto';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(createAssignmentDto);
  }

  @Get()
  async getAssignments() {
    return this.assignmentService.getAssignments();
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSubmission(
    @Param('id') assignmentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.assignmentService.uploadSubmission(
      assignmentId,
      file,
      body.studentName,
      body.rollNumber,
    );
  }

  @Post(':id/process-all')
  async processAllSubmissions(@Param('id') assignmentId: string) {
    return this.assignmentService.processAllSubmissions(assignmentId);
  }

  @Get(':id/submissions')
  async getSubmissions(@Param('id') assignmentId: string) {
    return this.assignmentService.getSubmissions(assignmentId);
  }

  @Get(':id/marks-sheet')
  async downloadMarksSheet(
    @Param('id') assignmentId: string,
    @Query('format') format: 'excel' | 'csv' = 'excel',
    @Res() res: express.Response,
  ) {
    const buffer = await this.assignmentService.generateMarksSheet(
      assignmentId,
      format,
    );

    const filename = `marks-sheet-${assignmentId}.${format === 'excel' ? 'xlsx' : 'csv'}`;
    const contentType =
      format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  @Post('submissions/:submissionId/process')
  async processSubmission(@Param('submissionId') submissionId: string) {
    return this.assignmentService.processSubmission(submissionId);
  }
}
