/* eslint-disable*/
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('ask')
  async askQuestion(@Body() body: { userId: string; question: string }) {
    console.log(body.userId);
    return this.matchesService.answerQuestion(body.userId, body.question);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.matchesService.getConversationHistory(userId);
  }

  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string) {
    return { summary: await this.matchesService.getSummary(userId) };
  }

  @Delete('memory/:userId')
  async clearMemory(@Param('userId') userId: string) {
    return { success: await this.matchesService.clearUserMemory(userId) };
  }
}
