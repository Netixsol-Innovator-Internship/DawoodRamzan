/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentStatus } from './schemas/payment.schema';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private ordersService: OrdersService,
    private stripeService: StripeService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<any> {
    const order = await this.ordersService.findOne(
      createPaymentDto.orderId,
      userId,
      false,
    );

    // ✅ Create PaymentIntent in Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      order.total,
      'usd',
    );

    // ✅ Save in DB
    const payment = new this.paymentModel({
      orderId: order._id,
      userId,
      amount: order.total,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      transactionId: paymentIntent.id,
    });
    console.log(payment);
    await payment.save();

    // ✅ Return clientSecret to frontend
    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      stripePaymentIntentId: paymentIntent.id,
    };
  }

  async confirm(paymentId: string, userId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ _id: paymentId, userId });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = PaymentStatus.COMPLETED; // 👈 mark completed
    await payment.save();

    return payment;
  }

  async findAll(userId: string, isAdmin = false): Promise<Payment[]> {
    if (isAdmin) {
      return this.paymentModel
        .find()
        .populate('orderId')
        .populate('userId', 'username email')
        .exec();
    }
    return this.paymentModel.find({ userId }).populate('orderId').exec();
  }

  async findOne(id: string, userId: string, isAdmin = false): Promise<Payment> {
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
