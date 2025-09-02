/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../User/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ✅ Get all reviews for a tea
  @Get('tea/:teaId')
  async getReviews(@Param('teaId') teaId: string) {
    return this.reviewService.getReviewsByTeaId(teaId);
  }

  // ✅ Post a new review (requires login)
  @UseGuards(JwtAuthGuard)
  @Post('tea/:teaId')
  async createReview(
    @Param('teaId') teaId: string,
    @Request() req,
    @Body('content') content: string,
    @Body('parentId') parentId?: string,
  ) {
    return this.reviewService.createReview(
      teaId,
      req.user.id, // 👈 comes from decoded JWT
      content,
      parentId,
    );
  }
}
