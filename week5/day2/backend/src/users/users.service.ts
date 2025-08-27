/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: Partial<User>) {
    const created = new this.userModel(data);
    return created.save();
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
  async findPublicById(id: string) {
    const u = await this.userModel.findById(id).select('-password').exec();
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
  async follow(userId: string, targetId: string) {
    // simple follower toggle
    const target = await this.userModel.findById(targetId);
    if (!target) throw new NotFoundException('Target not found');
    if (!target.followers) target.followers = [];
    if (target.followers.includes(userId)) {
      target.followers = target.followers.filter((f) => f !== userId);
    } else {
      target.followers.push(userId);
    }
    await target.save();
    return target;
  }
}
