/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

@Injectable()
export class RankerAgent {
  private tfidf: natural.TfIdf;

  constructor() {
    this.tfidf = new natural.TfIdf();
  }

  rankDocuments(query: string, documents: any[]): any[] {
    // Reset TF-IDF
    this.tfidf = new natural.TfIdf();

    // Add documents to TF-IDF
    documents.forEach((doc, index) => {
      this.tfidf.addDocument(doc.content);
    });

    // Calculate scores
    const scores = documents.map((doc, index) => {
      let score = 0;
      this.tfidf.tfidfs(query, (i, measure) => {
        if (i === index) {
          score += measure;
        }
      });
      return { document: doc, score };
    });

    // Sort by score descending
    return scores.sort((a, b) => b.score - a.score).slice(0, 3);
  }
}
