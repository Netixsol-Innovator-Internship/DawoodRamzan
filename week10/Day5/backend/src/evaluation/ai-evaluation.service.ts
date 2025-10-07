/* eslint-disable*/
// src/evaluation/ai-evaluation.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StateGraph } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';

// Define the state interface with proper annotations
interface EvaluationState {
  assignmentInstructions: string;
  submissionText: string;
  evaluationMode: 'strict' | 'loose';
  wordCount: number;
  relevanceScore: number;
  structureScore: number;
  topicAlignmentScore: number;
  finalScore: number;
  remarks: string;
}

// Create state schema with annotations
const StateAnnotations = {
  assignmentInstructions: Annotation<string>,
  submissionText: Annotation<string>,
  evaluationMode: Annotation<'strict' | 'loose'>,
  wordCount: Annotation<number>,
  relevanceScore: Annotation<number>,
  structureScore: Annotation<number>,
  topicAlignmentScore: Annotation<number>,
  finalScore: Annotation<number>,
  remarks: Annotation<string>,
};

@Injectable()
export class AiEvaluationService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private createEvaluationGraph() {
    const workflow = new StateGraph(StateAnnotations)
      .addNode('analyzeRelevance', async (state: EvaluationState) => {
        console.log('Analyzing relevance...');
        const relevanceScore = await this.analyzeRelevance(
          state.assignmentInstructions,
          state.submissionText,
        );
        return {
          relevanceScore,
        };
      })
      .addNode('analyzeStructure', async (state: EvaluationState) => {
        console.log('Analyzing structure...');
        const structureScore = await this.analyzeStructure(
          state.submissionText,
        );
        return {
          structureScore,
        };
      })
      .addNode('analyzeTopicAlignment', async (state: EvaluationState) => {
        console.log('Analyzing topic alignment...');
        const topicAlignmentScore = await this.analyzeTopicAlignment(
          state.assignmentInstructions,
          state.submissionText,
        );
        return {
          topicAlignmentScore,
        };
      })
      .addNode('calculateFinalScore', async (state: EvaluationState) => {
        console.log('Calculating final score...');
        const { finalScore, remarks } = await this.calculateFinalScore(state);
        return {
          finalScore,
          remarks,
        };
      });

    // Define the graph flow
    workflow.addEdge('analyzeRelevance', 'analyzeStructure');
    workflow.addEdge('analyzeStructure', 'analyzeTopicAlignment');
    workflow.addEdge('analyzeTopicAlignment', 'calculateFinalScore');

    // Set entry point
    workflow.setEntryPoint('analyzeRelevance');

    return workflow.compile();
  }

  private async analyzeRelevance(
    instructions: string,
    submission: string,
  ): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });

      const prompt = `
        Strictly Analyze the relevance of this student submission to the assignment instructions.
        
        ASSIGNMENT INSTRUCTIONS: ${instructions}
        
        STUDENT SUBMISSION: ${submission.substring(0, 2000)}
        
        Evaluate how well the submission addresses the key requirements and stays relevant to the topic.
        Consider if the content directly responds to what was asked in the assignment.
        
        Provide a relevance score from 0-10 where:
        0-3: Completely irrelevant or misses the point
        4-6: Somewhat relevant but misses key aspects
        7-8: Mostly relevant with minor deviations  
        9-10: Highly relevant and addresses all key points
        
        Return ONLY the numeric score without any additional text:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const score = this.extractNumericScore(text);

      console.log(`Relevance analysis - Raw: "${text}", Parsed: ${score}`);
      return score;
    } catch (error) {
      console.error('Error in relevance analysis:', error);
      return 5; // Default score on error
    }
  }

  private async analyzeStructure(submission: string): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });

      const prompt = `
        Strictly Analyze the structure and organization of this student submission:
        
        SUBMISSION: ${submission.substring(0, 2000)}
        
        Evaluate the structural quality based on:
        1. Clear introduction that sets up the topic
        2. Well-organized body paragraphs with logical flow
        3. Proper transitions between ideas
        4. Clear conclusion that summarizes key points
        5. Overall coherence and readability
        
        Provide a structure score from 0-10 where:
        0-3: Poor structure, difficult to follow
        4-6: Basic structure with some organizational issues
        7-8: Good structure with clear organization
        9-10: Excellent structure with seamless flow
        
        Return ONLY the numeric score without any additional text:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const score = this.extractNumericScore(text);

      console.log(`Structure analysis - Raw: "${text}", Parsed: ${score}`);
      return score;
    } catch (error) {
      console.error('Error in structure analysis:', error);
      return 5;
    }
  }

  private async analyzeTopicAlignment(
    instructions: string,
    submission: string,
  ): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });

      const prompt = `
        Strictly Analyze how well the student submission aligns with and stays on the assigned topic:
        
        ASSIGNMENT INSTRUCTIONS: ${instructions}
        STUDENT SUBMISSION: ${submission.substring(0, 2000)}
        
        Evaluate topic alignment by considering:
        - How closely the content matches the assigned topic
        - Whether the submission stays focused or goes off-topic
        - If the main themes from instructions are properly addressed
        - Presence of irrelevant or tangential content
        
        Provide a topic alignment score from 0-10 where:
        0-3: Completely off-topic or misunderstands assignment
        4-6: Partially on topic but significant deviations
        7-8: Mostly on topic with minor deviations
        9-10: Perfectly aligned with the topic
        
        Return ONLY the numeric score without any additional text:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const score = this.extractNumericScore(text);

      console.log(
        `Topic alignment analysis - Raw: "${text}", Parsed: ${score}`,
      );
      return score;
    } catch (error) {
      console.error('Error in topic alignment analysis:', error);
      return 5;
    }
  }

  private async calculateFinalScore(
    state: EvaluationState,
  ): Promise<{ finalScore: number; remarks: string }> {
    try {
      const {
        relevanceScore = 5,
        structureScore = 5,
        topicAlignmentScore = 5,
        evaluationMode,
        wordCount = 0,
        assignmentInstructions,
      } = state;

      // Calculate weighted base score
      let baseScore =
        relevanceScore * 0.4 + structureScore * 0.3 + topicAlignmentScore * 0.3;

      console.log(
        `Base score calculation: ${baseScore.toFixed(2)} (Relevance: ${relevanceScore}, Structure: ${structureScore}, Topic: ${topicAlignmentScore})`,
      );

      // Apply evaluation mode adjustments
      if (evaluationMode === 'strict') {
        // Strict mode: Heavy penalties for poor performance
        if (topicAlignmentScore < 4) baseScore *= 0.5;
        if (relevanceScore < 4) baseScore *= 0.6;
        if (structureScore < 4) baseScore *= 0.8;
      } else {
        // Loose mode: Rewards for effort and partial success
        if (topicAlignmentScore > 3) baseScore *= 1.1;
        if (relevanceScore > 3) baseScore *= 1.05;
        if (wordCount > 100) baseScore = Math.min(10, baseScore * 1.05);
      }

      // Word count adjustment based on target
      const targetWordCount = this.extractWordCount(assignmentInstructions);
      if (targetWordCount && targetWordCount > 0) {
        const wordCountRatio = wordCount / targetWordCount;
        console.log(
          `Word count ratio: ${wordCountRatio.toFixed(2)} (${wordCount}/${targetWordCount})`,
        );

        if (wordCountRatio < 0.5) {
          baseScore *= 0.7; // Heavy penalty for very short submissions
        } else if (wordCountRatio < 0.8) {
          baseScore *= 0.9; // Moderate penalty for short submissions
        } else if (wordCountRatio > 1.5) {
          baseScore *= 0.95; // Slight penalty for very long submissions
        } else if (wordCountRatio > 1.2) {
          baseScore *= 1.02; // Small bonus for slightly longer, thorough submissions
        }
      }

      const finalScore = Math.min(
        10,
        Math.max(0, Number(baseScore.toFixed(2))),
      );

      // Generate constructive remarks
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });
      const remarksPrompt = `
        Based on the following evaluation results, provide brief, constructive feedback for the student:
        Be strict and provide as low scores as possible
        EVALUATION RESULTS:
        - Relevance to Assignment: ${relevanceScore}/10
        - Structure and Organization: ${structureScore}/10  
        - Topic Alignment: ${topicAlignmentScore}/10
        - Final Score: ${finalScore.toFixed(1)}/10
        - Word Count: ${wordCount}
        - Grading Mode: ${evaluationMode}
        
        GUIDELINES:
        - Keep remarks professional and educational
        - Maximum 150 characters
        - Mention one strength and one area for improvement
        - Be encouraging but honest
        - Focus on the most important feedback
        
        Provide ONLY the remarks text:
      `;

      const result = await model.generateContent(remarksPrompt);
      const response = await result.response;
      let remarks = response.text().trim();

      // Ensure remarks are within length limit
      if (remarks.length > 150) {
        remarks = remarks.substring(0, 147) + '...';
      }

      console.log(`Final score: ${finalScore}, Remarks: ${remarks}`);

      return { finalScore, remarks };
    } catch (error) {
      console.error('Error in final score calculation:', error);
      return {
        finalScore: 5,
        remarks:
          'Evaluation completed. Focus on improving relevance and structure.',
      };
    }
  }

  private extractNumericScore(text: string): number {
    // Extract first numeric value from text
    const match = text.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const score = parseFloat(match[1]);
      return isNaN(score) ? 5 : Math.min(10, Math.max(0, score));
    }
    return 5; // Default score if no number found
  }

  private extractWordCount(instructions: string): number | null {
    const match = instructions.match(/(\d+)\s*words?/i);
    return match ? parseInt(match[1]) : null;
  }

  async evaluateSubmission(
    assignmentInstructions: string,
    submissionText: string,
    evaluationMode: 'strict' | 'loose',
  ): Promise<{ score: number; remarks: string; wordCount: number }> {
    try {
      const wordCount = submissionText.split(/\s+/).length;

      console.log(
        `Starting evaluation - Words: ${wordCount}, Mode: ${evaluationMode}`,
      );

      const graph = this.createEvaluationGraph();

      const initialState: EvaluationState = {
        assignmentInstructions,
        submissionText,
        evaluationMode,
        wordCount,
        relevanceScore: 0,
        structureScore: 0,
        topicAlignmentScore: 0,
        finalScore: 0,
        remarks: '',
      };

      const finalState = await graph.invoke(initialState);

      console.log('Evaluation completed:', finalState);

      return {
        score: finalState.finalScore || 0,
        remarks: finalState.remarks || 'Evaluation completed successfully.',
        wordCount,
      };
    } catch (error) {
      console.error('Error in evaluateSubmission:', error);
      const wordCount = submissionText.split(/\s+/).length;
      return {
        score: 0,
        remarks: 'Evaluation failed. Please try again.',
        wordCount,
      };
    }
  }
}
