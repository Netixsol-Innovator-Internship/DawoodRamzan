/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private notifications: NotificationsService,
  ) {}
  async list() {
    return this.commentModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar') // this will now populate from UserChats
      .populate('replies')
      .exec();
  }

  async create(authorId: string, content: string) {
    const c = new this.commentModel({ author: authorId, content });
    const saved = await c.save();
    // notify everyone (broadcast) via notifications service
    await this.notifications.broadcastNewComment(saved);
    return saved;
  }
  async reply(authorId: string, parentId: string, content: string) {
    const parent = await this.commentModel.findById(parentId);
    if (!parent) throw new NotFoundException('Parent not found');
    const reply = new this.commentModel({ author: authorId, content });
    const saved = await reply.save();
    parent.replies.push(saved._id as Types.ObjectId);
    await parent.save();
    // notify only parent author
    await this.notifications.notifyUser(parent.author.toString(), {
      type: 'reply',
      from: authorId,
      commentId: saved._id,
      parentId,
    });
    return saved;
  }
  async toggleLike(commentId: string, userId: string) {
    const c = await this.commentModel.findById(commentId);
    if (!c) throw new NotFoundException('Comment not found');
    const idx = c.likes.indexOf(userId);
    let liked = false;
    if (idx === -1) {
      c.likes.push(userId);
      liked = true;
      await this.notifications.notifyUser(c.author.toString(), {
        type: 'like',
        from: userId,
        commentId,
      });
    } else {
      c.likes.splice(idx, 1);
    }
    await c.save();
    return { liked, likesCount: c.likes.length };
  }
}
