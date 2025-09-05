/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentStatus } from './schemas/payment.schema';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private ordersService: OrdersService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<Payment> {
    const order = await this.ordersService.findOne(
      createPaymentDto.orderId,
      userId,
      false,
    );

    const payment = new this.paymentModel({
      orderId: order.userId,
      userId,
      amount: order.total,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
    });

    // Simulate payment processing
    // In a real application, this would integrate with a payment gateway
    setTimeout(async () => {
      payment.status = PaymentStatus.COMPLETED;
      await payment.save();

      // Update order status to processing after successful payment
      await this.ordersService.updateStatus(
        createPaymentDto.orderId,
        'processing' as any,
      );
    }, 2000);

    return payment.save();
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Payment[]> {
    if (isAdmin) {
      return this.paymentModel
        .find()
        .populate('orderId')
        .populate('userId', 'username email')
        .exec();
    }
    return this.paymentModel.find({ userId }).populate('orderId').exec();
  }

  async findOne(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<Payment> {
    const query = isAdmin ? { _id: id } : { _id: id, userId };
    const payment = await this.paymentModel
      .findOne(query)
      .populate('orderId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
