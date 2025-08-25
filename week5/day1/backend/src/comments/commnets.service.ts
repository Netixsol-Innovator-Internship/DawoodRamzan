import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-commnet.dto';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string; // ISO string
}

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];

  getAll() {
    return this.comments;
  }

  add(dto: CreateCommentDto) {
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2),
      text: dto.text,
      author: dto.author,
      createdAt: new Date().toISOString(),
    };
    this.comments.push(newComment);
    console.log(newComment.id);

    return newComment;
  }
}
