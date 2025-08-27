/* eslint-disable prettier/prettier */
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
      .find({ $or: [{ parentId: null }, { parentId: { $exists: false } }] })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        options: { sort: { createdAt: 1 } },
        populate: { path: 'author', select: 'username avatar' },
      })
      .exec();
  }

  async create(authorId: string, content: string) {
    const c = new this.commentModel({
      author: new Types.ObjectId(authorId),
      content,
      parentId: null,
    });
    const saved = await c.save();

    await this.notifications.broadcastNewComment(saved);
    return saved;
  }

  async reply(authorId: string, parentId: string, content: string) {
    const parent = await this.commentModel.findById(parentId);
    if (!parent) throw new NotFoundException('Parent not found');

    const replyDoc = new this.commentModel({
      author: new Types.ObjectId(authorId),
      content,
      parentId: new Types.ObjectId(parentId),
    });

    const savedReply = await replyDoc.save();

    parent.replies.push(savedReply._id as Types.ObjectId);
    await parent.save();

    // Notify only parent author
    await this.notifications.notifyUser(parent.author.toString(), {
      type: 'reply',
      from: authorId,
      commentId: savedReply._id,
      parentId,
    });

    return savedReply;
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

  async getThread(parentId: string) {
    const parent = await this.commentModel
      .findById(parentId)
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        options: { sort: { createdAt: 1 } },
        populate: { path: 'author', select: 'username avatar' },
      });

    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }
}
