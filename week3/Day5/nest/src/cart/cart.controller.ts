/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../User/jwt-auth.guard'; // 👈 custom guard

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Request() req,
    @Body('teaId') teaId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addToCart(req.user.id, teaId, quantity);
  }

  @Post('remove')
  async removeFromCart(@Request() req, @Body('teaId') teaId: string) {
    return this.cartService.removeFromCart(req.user.id, teaId);
  }

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('update')
  async updateCartQuantity(
    @Request() req,
    @Body('teaId') teaId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartQuantity(req.user.id, teaId, quantity);
  }
}
