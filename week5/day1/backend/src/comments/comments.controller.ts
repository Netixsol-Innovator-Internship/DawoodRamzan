import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentsService } from './commnets.service';
import { CreateCommentDto } from './dto/create-commnet.dto';
import { CommentsGateway } from './comments.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly service: CommentsService,
    private readonly gateway: CommentsGateway,
  ) {}

  @Get()
  findAll() {
    return this.service.getAll();
  }

  @Post()
  create(@Body() dto: CreateCommentDto) {
    const created = this.service.add(dto);
    // broadcast to all sockets
    this.gateway.emitNewComment(created);
    return created;
  }
}
