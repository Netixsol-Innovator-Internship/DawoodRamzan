/* eslint-disable */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AskModule } from './ask/ask.module';
import { UploadModule } from './upload/upload.module';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://dawoodramzan772_db_user:Daud9451@cluster0.v8fwlzh.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UploadModule,
    MongoModule,
    AskModule,
    AuthModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
