/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const natural = require('natural');

@Injectable()
export class SummarizerAgent {
  private tokenizer: any;

  constructor() {
    // Initialize sentence tokenizer from natural
    this.tokenizer = new natural.SentenceTokenizer();
  }

  summarizeDocument(content: string, maxSentences: number = 3): string {
    // Tokenize content into sentences
    const sentences: string[] = this.tokenizer.tokenize(content);

    if (sentences.length === 0) {
      return '';
    }

    // If total sentences <= maxSentences → return all
    if (sentences.length <= maxSentences) {
      return sentences.join(' ');
    }

    // Otherwise → pick first, middle, and last
    const summarySentences: string[] = [
      sentences[0].trim(),
      sentences[Math.floor(sentences.length / 2)].trim(),
      sentences[Math.floor(sentences.length / 3)].trim(),
      sentences[Math.floor(sentences.length / 4)].trim(),
      sentences[sentences.length - 1].trim(),
    ];

    return summarySentences.join(' ');
  }
}
