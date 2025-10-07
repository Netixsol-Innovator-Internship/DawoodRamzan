/* eslint-disable */
// src/evaluation/pdf-processing.service.ts
import { Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';

@Injectable()
export class PdfProcessingService {
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error: any) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  extractStudentInfo(text: string) {
    const nameMatch =
      text.match(/Name:\s*([^\n\r]+)/i) ||
      text.match(/Student:\s*([^\n\r]+)/i) ||
      text.match(/Submitted by:\s*([^\n\r]+)/i);

    const rollMatch =
      text.match(/Roll No:\s*([^\n\r]+)/i) ||
      text.match(/Roll Number:\s*([^\n\r]+)/i) ||
      text.match(/ID:\s*([^\n\r]+)/i);

    return {
      studentName: nameMatch ? nameMatch[1].trim() : 'Unknown',
      rollNumber: rollMatch ? rollMatch[1].trim() : 'Unknown',
    };
  }
}
