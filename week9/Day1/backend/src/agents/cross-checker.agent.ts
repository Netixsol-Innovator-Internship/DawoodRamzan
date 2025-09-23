/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class CrossCheckerAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  }

  async checkContradictions(summaries: string[]): Promise<string[]> {
    if (summaries.length < 2) {
      return [];
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    Analyze these summaries and identify any contradictions or conflicting information.
    Return only the contradictions as a JSON array of strings, or an empty array if none.

    Summaries:
    ${summaries.map((s, i) => `Summary ${i + 1}: ${s}`).join('\n')}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const contradictions = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      return contradictions;
    } catch (error) {
      console.error('Error checking contradictions:', error);
      return [];
    }
  }
}
