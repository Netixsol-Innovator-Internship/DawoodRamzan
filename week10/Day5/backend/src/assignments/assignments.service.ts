/* eslint-disable */
// src/assignment/assignment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from '../schemas/assignment.schema';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';
import { CreateAssignmentDto } from '../dto/create-assignment.dto';
import { AiEvaluationService } from '../evaluation/ai-evaluation.service';
import { PdfProcessingService } from '../evaluation/pdf-processing.service';
import { FileUploadService } from './file-upload.service';
import * as ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import { Types } from 'mongoose';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private aiEvaluationService: AiEvaluationService,
    private pdfProcessingService: PdfProcessingService,
    private fileUploadService: FileUploadService,
  ) {}

  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = new this.assignmentModel(createAssignmentDto);
    return assignment.save();
  }

  async getAssignments(): Promise<Assignment[]> {
    return this.assignmentModel.find().sort({ createdAt: -1 }).exec();
  }

  async uploadSubmission(
    assignmentId: string,
    file: Express.Multer.File,
    studentName: string,
    rollNumber: string,
  ): Promise<Submission> {
    const assignment = await this.assignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const filePath = await this.fileUploadService.saveFile(file);
    const pdfText = await this.pdfProcessingService.extractTextFromPdf(
      file.buffer,
    );

    const submission = new this.submissionModel({
      assignmentId,
      studentName,
      rollNumber,
      fileName: file.originalname,
      filePath,
      extractedText: pdfText,
      wordCount: pdfText.split(/\s+/).length,
      status: 'pending',
    });

    return submission.save();
  }

  async processSubmission(submissionId: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const assignment = await this.assignmentModel.findById(
      submission.assignmentId,
    );
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    try {
      const evaluation = await this.aiEvaluationService.evaluateSubmission(
        assignment.instructions,
        submission.extractedText,
        assignment.evaluationMode,
      );

      submission.score = evaluation.score;
      submission.remarks = evaluation.remarks;
      submission.status = 'processed';

      return submission.save();
    } catch (error) {
      submission.status = 'error';
      await submission.save();
      throw error;
    }
  }

  async processAllSubmissions(
    assignmentId: string,
  ): Promise<{ processed: number; total: number }> {
    const submissions = await this.submissionModel.find({
      assignmentId,
      status: 'pending',
    });

    let processed = 0;
    for (const submission of submissions) {
      try {
        const id = submission._id as Types.ObjectId;

        await this.processSubmission(id.toString());
        processed++;
      } catch (error) {
        console.error(`Error processing submission ${submission._id}:`, error);
      }
    }

    return { processed, total: submissions.length };
  }

  async generateMarksSheet(
    assignmentId: string,
    format: 'excel' | 'csv',
  ): Promise<Buffer> {
    const submissions = await this.submissionModel
      .find({ assignmentId, status: 'processed' })
      .sort({ studentName: 1 })
      .exec();

    if (format === 'excel') {
      return this.generateExcelMarksSheet(submissions);
    } else {
      return this.generateCsvMarksSheet(submissions);
    }
  }

  private async generateExcelMarksSheet(
    submissions: Submission[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Marks Sheet');

    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 30 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Word Count', key: 'wordCount', width: 12 },
      { header: 'Remarks', key: 'remarks', width: 50 },
    ];

    submissions.forEach((submission) => {
      worksheet.addRow({
        studentName: submission.studentName,
        rollNumber: submission.rollNumber,
        score: submission.score,
        wordCount: submission.wordCount,
        remarks: submission.remarks,
      });
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }

  private async generateCsvMarksSheet(
    submissions: Submission[],
  ): Promise<Buffer> {
    const csvWriter = createObjectCsvWriter({
      path: 'temp.csv',
      header: [
        { id: 'studentName', title: 'Student Name' },
        { id: 'rollNumber', title: 'Roll Number' },
        { id: 'score', title: 'Score' },
        { id: 'wordCount', title: 'Word Count' },
        { id: 'remarks', title: 'Remarks' },
      ],
    });

    const records = submissions.map((submission) => ({
      studentName: submission.studentName,
      rollNumber: submission.rollNumber,
      score: submission.score,
      wordCount: submission.wordCount,
      remarks: submission.remarks,
    }));

    await csvWriter.writeRecords(records);

    // In a real implementation, you'd read the file back as buffer
    // For simplicity, we'll create CSV string and convert to buffer
    const csvString = [
      'Student Name,Roll Number,Score,Word Count,Remarks',
      ...records.map(
        (r) =>
          `"${r.studentName}","${r.rollNumber}",${r.score},${r.wordCount},"${r.remarks}"`,
      ),
    ].join('\n');

    return Buffer.from(csvString, 'utf-8');
  }

  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    return this.submissionModel
      .find({ assignmentId })
      .sort({ submittedAt: -1 })
      .exec();
  }
}
