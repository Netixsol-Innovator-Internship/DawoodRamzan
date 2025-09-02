import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from '../Schema/cart.schema';
import { Tea, TeaDocument } from '../Schema/tea.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Tea.name) private teaModel: Model<TeaDocument>,
  ) {}

  async addToCart(userId: string, teaId: string, quantity: number) {
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const tea = await this.teaModel.findById(teaId);
    if (!tea) throw new NotFoundException('Tea not found');

    const itemIndex = cart.items.findIndex((i) => i.tea.toString() === teaId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ tea: new Types.ObjectId(teaId), quantity });
    }

    return cart.save();
  }

  async removeFromCart(userId: string, teaId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((i) => i.tea.toString() !== teaId);
    return cart.save();
  }

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.tea');
    return cart || { user: userId, items: [] };
  }

  async updateCartQuantity(userId: string, teaId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const itemIndex = cart.items.findIndex((i) => i.tea.toString() === teaId);
    if (itemIndex === -1) throw new NotFoundException('Item not in cart');

    cart.items[itemIndex].quantity = quantity;
    return cart.save();
  }
}
