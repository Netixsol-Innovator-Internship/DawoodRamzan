/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDocument } from '../database/schemas/document.schema';

@Injectable()
export class DocumentFinderAgent {
  constructor(
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocument>,
  ) {}

  async findDocuments(
    subQuestion: string,
    topic?: string,
  ): Promise<ResearchDocument[]> {
    let query: any = {};

    if (topic) {
      query.topic = new RegExp(topic, 'i');
    }

    // Simple keyword matching as fallback
    const keywords = this.extractKeywords(subQuestion);
    if (keywords.length > 0) {
      query.$or = [
        { content: new RegExp(keywords.join('|'), 'i') },
        { title: new RegExp(keywords.join('|'), 'i') },
      ];
    }

    return this.documentModel.find(query).limit(10).exec();
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'is',
      'are',
      'what',
      'when',
      'how',
      'why',
      'vs',
      'versus',
    ]);
    const words = text.toLowerCase().split(/\s+/);
    return words.filter((word) => word.length > 3 && !stopWords.has(word));
  }
}
