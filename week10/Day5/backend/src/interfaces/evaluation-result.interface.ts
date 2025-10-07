// src/interfaces/evaluation-result.interface.ts
export interface EvaluationResult {
  score: number;
  remarks: string;
  wordCount: number;
  relevance: number;
  structure: number;
  topicAlignment: number;
}
