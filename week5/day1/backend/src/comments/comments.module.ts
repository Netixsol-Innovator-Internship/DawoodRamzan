import { Module } from '@nestjs/common';
import { CommentsService } from './commnets.service';
import { CommentsGateway } from './comments.gateway';
import { CommentsController } from './comments.controller';

@Module({
  providers: [CommentsService, CommentsGateway],
  controllers: [CommentsController],
})
export class CommentsModule {}
