// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research.controller';
import { ResearchWorkflow } from './workflow/research-workflow';
import { QuestionSplitterAgent } from './agents/question-splitter.agent';
import { DocumentFinderAgent } from './agents/document-finder.agent';
import { RankerAgent } from './agents/ranker.agent';
import { SummarizerAgent } from './agents/summarizer.agent';
import { CrossCheckerAgent } from './agents/cross-checker.agent';
import { FinalAnswerAgent } from './agents/final-answer.agent';
import {
  ResearchDocument,
  ResearchDocumentSchema,
} from './database/schemas/document.schema';
import {
  ResearchQuery,
  ResearchQuerySchema,
} from './database/schemas/query.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ??
        'mongodb+srv://Daud:Daud9451@cluster0.bamu5mm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
      { name: ResearchQuery.name, schema: ResearchQuerySchema },
    ]),
  ],
  controllers: [ResearchController, AppController],
  providers: [
    ResearchWorkflow,
    QuestionSplitterAgent,
    DocumentFinderAgent,
    RankerAgent,
    SummarizerAgent,
    CrossCheckerAgent,
    FinalAnswerAgent,
    AppService,
  ],
})
export class AppModule {}
