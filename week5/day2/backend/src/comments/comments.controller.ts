/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('comments')
export class CommentsController {
  constructor(private comments: CommentsService) {}
  @Get()
  async list() {
    return this.comments.list();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Req() req: any, @Body('content') content: string) {
    return this.comments.create(req.user.userId, content);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('reply/:parentId')
  async reply(
    @Req() req: any,
    @Param('parentId') parentId: string,
    @Body('content') content: string,
  ) {
    return this.comments.reply(req.user.userId, parentId, content);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  async like(@Req() req: any, @Param('id') id: string) {
    return this.comments.toggleLike(id, req.user.userId);
  }
}
