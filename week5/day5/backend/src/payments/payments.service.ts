/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuctionsService } from '../auctions/auctions.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private auctionsService: AuctionsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const createdPayment = new this.paymentModel(createPaymentDto);
    return createdPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('auction').populate('user').exec();
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate('auction')
      .populate('user')
      .exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ user: userId }).populate('auction').exec();
  }

  async findByAuction(auctionId: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findOne({ auction: auctionId })
      .populate('user')
      .exec();
    if (!payment) {
      throw new NotFoundException('Payment not found for this auction');
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .populate('auction')
      .populate('user')
      .exec();
    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }
    return updatedPayment;
  }

  async remove(id: string): Promise<Payment> {
    const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!deletedPayment) {
      throw new NotFoundException('Payment not found');
    }
    return deletedPayment;
  }

  async processPayment(paymentId: string): Promise<Payment> {
    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(paymentId, { status: 'completed' }, { new: true })
      .populate('auction')
      .populate('user')
      .exec();

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Complete the auction
    if (updatedPayment.auction) {
      await this.auctionsService.completeAuction(
        updatedPayment.auction.toString(),
      );
    }

    return updatedPayment;
  }
}
