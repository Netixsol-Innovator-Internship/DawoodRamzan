// auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTea, UserTeaSchema } from '../Schema/User.schema';
import { AuthService } from './User.service';
import { AuthController } from './User.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserTea.name, schema: UserTeaSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
