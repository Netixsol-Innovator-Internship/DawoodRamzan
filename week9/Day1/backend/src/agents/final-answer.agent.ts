/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class FinalAnswerAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  }

  async createFinalAnswer(
    question: string,
    subQuestions: string[],
    summarizedResults: { [key: string]: string },
    contradictions: string[],
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const context = `
    Original Question: ${question}
    
    Research Results:
    ${Object.entries(summarizedResults)
      .map(
        ([subQ, answer]) => `
    ${subQ}: ${answer}
    `,
      )
      .join('\n')}
    
    ${contradictions.length > 0 ? `Contradictions found: ${contradictions.join(', ')}` : 'No contradictions found.'}
    `;

    const prompt = `
    Based on the research results below, write a comprehensive, well-structured answer to the original question.
    Address any contradictions if present. Be objective and cite the information appropriately.

    ${context}

    Provide a clear, detailed answer:
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error creating final answer:', error);
      return this.createFallbackAnswer(summarizedResults);
    }
  }

  private createFallbackAnswer(summarizedResults: {
    [key: string]: string;
  }): string {
    return Object.entries(summarizedResults)
      .map(([question, answer]) => `**${question}**\n${answer}\n`)
      .join('\n');
  }
}
