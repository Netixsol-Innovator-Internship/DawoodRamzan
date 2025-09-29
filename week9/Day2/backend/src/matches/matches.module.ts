/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { Conversation,ConversationSchema } from 'src/schema/conversation.schema';
import { Summary,SummarySchema } from 'src/schema/summary.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Summary.name, schema: SummarySchema },
    ]),
    GeminiModule,
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
