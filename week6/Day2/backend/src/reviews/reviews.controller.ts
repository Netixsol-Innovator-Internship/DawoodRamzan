/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt.gaurd';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('customer')
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    console.log(req.user);
    console.log(req.user.userId);

    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:productId')
  findAllByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'customer')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
