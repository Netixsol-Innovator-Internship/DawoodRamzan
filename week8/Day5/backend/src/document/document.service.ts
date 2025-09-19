/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import pdfParse from 'pdf-parse';
import { PDFDocument } from './schema/document.schema';
import { GeminiService } from '../gemini.service';

// LangGraph imports
import { StateGraph, Annotation } from '@langchain/langgraph';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(PDFDocument.name) private docModel: Model<PDFDocument>,
    private gemini: GeminiService,
  ) {}

  async processPDF(file: Express.Multer.File) {
    const pdfData = await pdfParse(file.buffer);
    const text = pdfData.text;

    // --- Define State Shape ---
    const DocState = Annotation.Root({
      text: Annotation<string>,
      chunks: Annotation<string[]>,
      vectors: Annotation<number[][]>,
      summary: Annotation<string>,
      category: Annotation<string>,
      highlights: Annotation<string[]>,
    });

    // --- Build Graph ---
    const graph = new StateGraph(DocState)
      // Split PDF into chunks
      .addNode('split', async (state) => {
        const chunks: string[] = [];
        for (let i = 0; i < state.text.length; i += 1000) {
          chunks.push(state.text.slice(i, i + 1000));
        }
        // console.log(chunks);
        return { chunks };
      })

      //Create embeddings
      //       .addNode('embed', async (state) => {
      //         const vectors = await Promise.all(
      //           state.chunks.map((c) => this.gemini.embedText(c)),
      //         );
      // console.log('Vectors:', JSON.stringify(vectors[0].slice(0, 10)));
      //         return { vectors };
      //       })

      // Summarization
      .addNode('summarize', async (state) => {
        const summary = await this.gemini.generateText(
          `Summarize this document:\n${state.text.substring(0, 3000)}`,
        );
        // console.log(summary);
        return { summary };
      })

      // Categorization
      .addNode('categorize', async (state) => {
        const category = await this.gemini.generateText(
          `Classify into: Research Paper, Business Report, User Manual, Other:\n${state.text.substring(0, 1000)}`,
        );
        // console.log('Category______________' + category);
        return { category };
      })

      // Highlights
      .addNode('highlight', async (state) => {
        const highlightsRaw = await this.gemini.generateText(
          `Give 5 bullet highlights:\n${state.text.substring(0, 2000)}`,
        );
        const highlights = highlightsRaw.split('\n').filter(Boolean);
        return { highlights };
      });

    // --- Connect Graph ---
    graph
      .addEdge('__start__', 'split')
      .addEdge('split', 'summarize')
      //   .addEdge('embed', 'summarize')
      .addEdge('summarize', 'categorize')
      .addEdge('categorize', 'highlight')
      .addEdge('highlight', '__end__');

    const app = graph.compile();

    // --- Run Pipeline ---
    const result = await app.invoke({ text });

    // --- Save to DB ---
    const newDoc = new this.docModel({
      filename: file.originalname,
      summary: result.summary,
      category: result.category,
      highlights: result.highlights,
      embeddings: result.vectors,
    });

    // console.log('--------');
    return newDoc.save();
  }

  async askQuestion(docId: string, question: string) {
    const doc = await this.docModel.findById(docId);
    if (!doc) return { answer: 'Document not found' };

    // console.log('----------------ANSWER---------------------------');
    const context =
      doc.summary + '\n' + doc.category + '\n' + doc.highlights.join('\n');
    // console.log('Context is ______________________________' + context);
    const prompt = `Answer strictly  from the context and provide a detailed answer of 200 words. If not found, say "Answer not found in document".

    Context:
    ${context}

    Question: What is  ${question}?`;
    // console.log(
    //   'Prompt------------------------------------------***********************************************' +
    //     prompt,
    // );

    const answer = await this.gemini.generateText(prompt);
    // console.log(answer);
    return { answer };
  }
}
