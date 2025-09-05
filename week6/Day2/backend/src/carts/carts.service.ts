/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItemDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      cart = new this.cartModel({ userId, items: [], total: 0 });
      await cart.save();
    }

    return cart;
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
    
  ): Promise<CartDocument> {
    const product = await this.productsService.findOne(productId);

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      const point=product.point>0 ? product.point : 0 ;
      cart.items.push({
        productId: product._id, // already an ObjectId
        name: product.name,
        price,
        quantity,
        size,
        point,
        image: product.images[0],
      } as CartItemDocument);
    }

    cart.total = this.calculateTotal(cart.items);
    return cart.save();
  }

  async getCartItemById(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.id(itemId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    return item;
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartDocument> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.id(itemId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    const product = await this.productsService.findOne(
      item.productId.toString(),
    );

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    item.quantity = quantity;
    cart.total = this.calculateTotal(cart.items);

    return cart.save();
  }

  async removeFromCart(userId: string, itemId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.id(itemId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.deleteOne(); // removes the subdocument
    cart.total = this.calculateTotal(cart.items);

    return cart.save();
  }

  async clearCart(userId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [] as any;
    cart.total = 0;

    return cart.save();
  }

  private calculateTotal(items: Types.DocumentArray<CartItemDocument>): number {
    return items.reduce(
      (total, item) => total + (item?.price | item?.point) * item.quantity,
      0,
    );
  }
}
