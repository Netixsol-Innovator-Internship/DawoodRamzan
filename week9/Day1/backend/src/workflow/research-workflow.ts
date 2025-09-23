/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { QuestionSplitterAgent } from '../agents/question-splitter.agent';
import { DocumentFinderAgent } from '../agents/document-finder.agent';
import { RankerAgent } from '../agents/ranker.agent';
import { SummarizerAgent } from '../agents/summarizer.agent';
import { CrossCheckerAgent } from '../agents/cross-checker.agent';
import { FinalAnswerAgent } from '../agents/final-answer.agent';

@Injectable()
export class ResearchWorkflow {
  constructor(
    private questionSplitter: QuestionSplitterAgent,
    private documentFinder: DocumentFinderAgent,
    private ranker: RankerAgent,
    private summarizer: SummarizerAgent,
    private crossChecker: CrossCheckerAgent,
    private finalAnswer: FinalAnswerAgent,
  ) {}

  async execute(question: string): Promise<{
    answer: string;
    trace: any;
    contradictions: string[];
  }> {
    const trace: any = {
      startedAt: new Date(),
      originalQuestion: question,
      steps: [],
    };

    // Step 1: Split question
    trace.steps.push({ name: 'QuestionSplitter', startedAt: new Date() });
    const subQuestions = await this.questionSplitter.splitQuestion(question);
    trace.steps[0].result = subQuestions;
    trace.steps[0].completedAt = new Date();

    // Step 2: Find documents for each sub-question
    trace.steps.push({ name: 'DocumentFinder', startedAt: new Date() });
    const documentResults: { [key: string]: any[] } = {};

    for (const subQ of subQuestions) {
      const documents = await this.documentFinder.findDocuments(subQ);
      documentResults[subQ] = documents;
    }
    trace.steps[1].result = documentResults;
    trace.steps[1].completedAt = new Date();

    // Step 3: Rank documents
    trace.steps.push({ name: 'Ranker', startedAt: new Date() });
    const rankedResults: { [key: string]: any[] } = {};

    for (const [subQ, docs] of Object.entries(documentResults)) {
      rankedResults[subQ] = this.ranker.rankDocuments(subQ, docs);
    }
    trace.steps[2].result = rankedResults;
    trace.steps[2].completedAt = new Date();

    // Step 4: Summarize documents
    trace.steps.push({ name: 'Summarizer', startedAt: new Date() });
    const summarizedResults: { [key: string]: string } = {};

    for (const [subQ, rankedDocs] of Object.entries(rankedResults)) {
      const summaries = rankedDocs.map((doc) =>
        this.summarizer.summarizeDocument(doc.document.content),
      );
      summarizedResults[subQ] = summaries.join(' ');
    }
    trace.steps[3].result = summarizedResults;
    trace.steps[3].completedAt = new Date();

    // Step 5: Cross-check
    trace.steps.push({ name: 'CrossChecker', startedAt: new Date() });
    const allSummaries = Object.values(summarizedResults);
    const contradictions =
      await this.crossChecker.checkContradictions(allSummaries);
    trace.steps[4].result = contradictions;
    trace.steps[4].completedAt = new Date();

    // Step 6: Final answer
    trace.steps.push({ name: 'FinalAnswer', startedAt: new Date() });
    const finalAnswer = await this.finalAnswer.createFinalAnswer(
      question,
      subQuestions,
      summarizedResults,
      contradictions,
    );
    trace.steps[5].result = finalAnswer;
    trace.steps[5].completedAt = new Date();

    trace.completedAt = new Date();

    return {
      answer: finalAnswer,
      trace,
      contradictions,
    };
  }
}
