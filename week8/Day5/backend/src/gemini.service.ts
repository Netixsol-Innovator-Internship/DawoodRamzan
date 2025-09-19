/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';

@Injectable()
export class GeminiService {
  private llm: ChatGoogleGenerativeAI;
  private embedder: GoogleGenerativeAIEmbeddings;

  constructor() {
    // Text generation model
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Embeddings model
    this.embedder = new GoogleGenerativeAIEmbeddings({
      model: 'embedding-001',
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateText(prompt: string): Promise<string> {
    const res = await this.llm.invoke(prompt);
    return res.content.toString();
  }

  async embedText(text: string): Promise<number[]> {
    return this.embedder.embedQuery(text);
  }
}
