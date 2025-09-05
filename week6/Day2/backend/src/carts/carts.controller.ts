/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt.gaurd';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('carts')
@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('customer')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartsService.getOrCreateCart(req.user.userId);
  }

  @Post('add')
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req) {
    console.log(req.productId);
    console.log(req.user.userId);
    return this.cartsService.addToCart(
      req.user.userId,
      addToCartDto.productId,
      addToCartDto.quantity,
      addToCartDto.size,
    );
  }

  @Get('item/:itemId')
  async getCartItem(@Param('itemId') itemId: string, @Request() req) {
    return this.cartsService.getCartItemById(req.user.userId, itemId);
  }

  @Put('item/:itemId')
  updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Request() req,
  ) {
    return this.cartsService.updateCartItem(
      req.user.userId,
      itemId,
      updateCartDto.quantity,
    );
  }

  @Delete('item/:itemId')
  removeFromCart(@Param('itemId') itemId: string, @Request() req) {
    return this.cartsService.removeFromCart(req.user.userId, itemId);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartsService.clearCart(req.user.userId);
  }
}
