import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../Schema/review.schema';
import { Tea, TeaSchema } from '../Schema/tea.schema';
import { UserTea, UserTeaSchema } from '../Schema/User.schema';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Tea.name, schema: TeaSchema },
      { name: UserTea.name, schema: UserTeaSchema },
    ]),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
