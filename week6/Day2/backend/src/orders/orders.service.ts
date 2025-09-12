/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartsService: CartsService,
    private productsService: ProductsService,
    private usersService: UsersService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const cart = await this.cartsService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // ✅ Check stock and update products
    for (const item of cart.items) {
      const product = await this.productsService.findOne(
        item.productId.toString(),
      );
      if (!product) {
        throw new Error(
          `Product not found for id: ${item.productId.toString()}`,
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      await this.productsService.updateStock(
        item.productId.toString(),
        item.quantity,
      );
    }

    const user = await this.usersService.findById(userId);

    // ✅ Auto-increment orderNumber
    const lastOrder = await this.orderModel
      .findOne()
      .sort({ orderNumber: -1 })
      .exec();
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    const order = new this.orderModel({
      orderNumber,
      userId,
      customerName: user.username,
      items: cart.items,
      total: cart.total,
      shippingAddress: createOrderDto.shippingAddress,
      status: OrderStatus.PENDING,
      paidUsing: createOrderDto.paidUsing,
    });

    const savedOrder = await order.save();

    // --- ✅ Handle user points ---
    let pointsToSubtract = 0;
    let pointsToAdd = 0;

    for (const item of cart.items) {
      // If product has a `point` price, subtract from user points
      if (item.point && !item.price) {
        pointsToSubtract += (item.point || 0) * item.quantity;
      }

      // If product has a `price`, award loyalty points
      if (item.price) {
        pointsToAdd += Math.floor((item.price * item.quantity) / 50);
      }
    }

    if (pointsToSubtract > 0) {
      await this.usersService.subPoints(userId, pointsToSubtract);
    }

    if (pointsToAdd > 0) {
      await this.usersService.addPoints(userId, pointsToAdd);
    }
    console.log(pointsToAdd + '-------' + pointsToSubtract);

    // Emit purchase notification
    try {
      const firstItem = cart.items[0];
      this.notificationsGateway.broadcastPurchase(
        user.username,
        firstItem?.name,
      );
      console.log('Emitted');
    } catch (e) {
      console.error('Failed to emit purchase event', e);

      // non-blocking
    }

    return savedOrder;
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Order[]> {
    if (isAdmin) {
      return this.orderModel.find().populate('userId', 'username email').exec();
    }
    return this.orderModel.find({ userId }).exec();
  }

  async findOne(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<Order> {
    const query = isAdmin ? { _id: id } : { _id: id, userId };
    const order = await this.orderModel.findOne(query).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ _id: id, userId }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Cannot cancel order that is already processed');
    }

    order.status = OrderStatus.CANCELLED;
    return order.save();
  }
}
