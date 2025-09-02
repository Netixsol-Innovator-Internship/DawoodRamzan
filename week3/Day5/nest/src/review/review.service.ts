import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../Schema/review.schema';
import { Tea, TeaDocument } from '../Schema/tea.schema';
import { UserTea, UserTeaDocument } from '../Schema/User.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Tea.name) private teaModel: Model<TeaDocument>,
    @InjectModel(UserTea.name) private userModel: Model<UserTeaDocument>,
  ) {}

  // ✅ Get all reviews for a tea (with nested replies)
  async getReviewsByTeaId(teaId: string) {
    const tea = await this.teaModel.findById(teaId);
    if (!tea) throw new NotFoundException('Tea not found');

    // 👇 debug: log reviews in DB
    const allReviews = await this.reviewModel.find().lean();
    console.log('All Reviews:', allReviews);

    return this.reviewModel
      .find({ teaId: teaId, parentId: null }) // <-- don't wrap in ObjectId
      .populate('userId', 'username')
      .populate({
        path: 'replies',
        populate: { path: 'userId', select: 'username' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // ✅ Post a new review (top-level or reply)
  async createReview(
    teaId: string,
    userId: string,
    content: string,
    parentId?: string,
  ) {
    const tea = await this.teaModel.findById(teaId);
    if (!tea) throw new NotFoundException('Tea not found');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const newReview = new this.reviewModel({
      teaId,
      userId,
      content,
      parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    const savedReview = await newReview.save();

    // If it's a reply, push into parent's `replies` array
    if (parentId) {
      await this.reviewModel.findByIdAndUpdate(parentId, {
        $push: { replies: savedReview._id },
      });
    }

    return savedReview.populate('userId', 'username');
  }
}
