import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CVService } from './cv.service';
import { CVController } from './cv.controller';
import { CV, CVSchema } from './cv.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CV.name, schema: CVSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CVController],
  providers: [CVService],
})
export class CVModule {}
