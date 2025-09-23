/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class QuestionSplitterAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  }

  async splitQuestion(question: string): Promise<string[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    Break down the following research question into 3-5 specific sub-questions that would help answer it comprehensively.
    Return only the sub-questions as a JSON array of strings.

    Question: ${question}

    Example output: ["What is SQL?", "What is NoSQL?", "What are the key differences?", "When to use each?"]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON array from response
      const subQuestions = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      console.log(subQuestions);

      return subQuestions;
    } catch (error) {
      console.error('Error splitting question:', error);
      // Fallback: simple keyword-based splitting
      return this.fallbackSplit(question);
    }
  }

  private fallbackSplit(question: string): string[] {
    console.log(question);
    const keywords = [
      'vs',
      'versus',
      'compare',
      'difference',
      'pros',
      'cons',
      'advantages',
      'disadvantages',
    ];
    const subQuestions: string[] = [];

    if (
      question.toLowerCase().includes('vs') ||
      question.toLowerCase().includes('versus')
    ) {
      const parts = question.split(/vs|versus/i);
      if (parts.length >= 2) {
        subQuestions.push(`What is ${parts[0].trim()}?`);
        subQuestions.push(`What is ${parts[1].trim()}?`);
        subQuestions.push(
          `What are the key differences between ${parts[0].trim()} and ${parts[1].trim()}?`,
        );
        subQuestions.push(
          `When to use ${parts[0].trim()} vs ${parts[1].trim()}?`,
        );
      }
    }

    if (subQuestions.length === 0) {
      subQuestions.push(question);
    }

    return subQuestions;
  }
}
