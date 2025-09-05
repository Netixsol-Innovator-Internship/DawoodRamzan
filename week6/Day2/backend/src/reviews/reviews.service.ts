import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private productsService: ProductsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    // Check if product exists
    await this.productsService.findOne(createReviewDto.productId);

    const createdReview = new this.reviewModel({
      ...createReviewDto,
      userId,
    });

    const savedReview = await createdReview.save();
    await this.updateProductRating(createReviewDto.productId);

    return savedReview;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('userId', 'username')
      .populate('productId', 'name') // optional: show product name
      .exec();
  }

  async findAllByProduct(productId: string): Promise<Review[]> {
    await this.productsService.findOne(productId);
    return this.reviewModel
      .find({ productId })
      .populate('userId', 'username')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('userId', 'username')
      .exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async remove(id: string): Promise<Review> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deletedReview) {
      throw new NotFoundException('Review not found');
    }

    await this.updateProductRating(deletedReview.productId.toString());
    return deletedReview;
  }

  private async updateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewModel.find({ productId }).exec();
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.productsService.update(productId, { rating: averageRating });
  }
}
