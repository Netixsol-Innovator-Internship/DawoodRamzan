/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ Auth/User imports
import { AuthController } from './User/User.controller';
import { AuthService } from './User/User.service';
import { UserTea, UserTeaSchema } from './Schema/User.schema';

// ✅ Feature modules
import { TeaModule } from './Tea/tea.module';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';

// ✅ Guards
import { JwtAuthGuard } from './User/jwt-auth.guard';
import { RolesGuard } from './User/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb+srv://Daud772:Daud9451@cluster1.71ghrlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
      }),
    }),

    MongooseModule.forFeature([{ name: UserTea.name, schema: UserTeaSchema }]),

    // 👇 make JwtService global
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),

    // 👇 Feature modules
    TeaModule,
    CartModule,
    ReviewModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtAuthGuard, RolesGuard],
})
export class AppModule {}
