// cart.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../Schema/cart.schema';
import { Tea, TeaSchema } from '../Schema/tea.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Tea.name, schema: TeaSchema },
    ]),
    JwtModule.register({
      // 👈 makes JwtService available in CartModule
      secret: process.env.JWT_SECRET || 'Daud',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
