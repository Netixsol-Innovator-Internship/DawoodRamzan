/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CarsService } from '../cars/cars.service';
import { BidsService } from '../bids/bids.service';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    private carsService: CarsService,
    private bidsService: BidsService,
  ) {}

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const createdAuction = new this.auctionModel(createAuctionDto);
    return createdAuction.save();
  }

  async findAll(): Promise<Auction[]> {
    return this.auctionModel
      .find()
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
  }

  async findById(id: string): Promise<Auction> {
    const auction = await this.auctionModel
      .findById(id)
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async findByCar(carId: string): Promise<Auction> {
    const auction = await this.auctionModel
      .findOne({ car: carId })
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
    if (!auction) {
      throw new NotFoundException('Auction not found for this car');
    }
    return auction;
  }

  async update(
    id: string,
    updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction> {
    const updatedAuction = await this.auctionModel
      .findByIdAndUpdate(id, updateAuctionDto, { new: true })
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
    if (!updatedAuction) {
      throw new NotFoundException('Auction not found');
    }
    return updatedAuction;
  }

  async remove(id: string): Promise<Auction> {
    const deletedAuction = await this.auctionModel.findByIdAndDelete(id).exec();
    if (!deletedAuction) {
      throw new NotFoundException('Auction not found');
    }
    return deletedAuction;
  }

  async addBidToAuction(
    auctionId: string,
    bidId: string,
  ): Promise<Auction | null> {
    return this.auctionModel
      .findByIdAndUpdate(
        auctionId,
        {
          $addToSet: { bids: bidId },
          $set: { currentBid: bidId },
        },
        { new: true },
      )
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
  }

  async completeAuction(id: string): Promise<Auction> {
    const updatedAuction = await this.auctionModel
      .findByIdAndUpdate(id, { status: 'completed' }, { new: true })
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();

    if (!updatedAuction) {
      throw new NotFoundException('Auction not found');
    }

    // ✅ Ensure populated car exists and has _id
    if (updatedAuction.car && '_id' in updatedAuction.car) {
      await this.carsService.update(updatedAuction.car.toString(), {
        status: 'sold',
      });
    }
    return updatedAuction;
  }

  async getActiveAuctions(): Promise<Auction[]> {
    return this.auctionModel
      .find({ status: 'active', endTime: { $gt: new Date() } })
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
  }

  async getExpiredAuctions(): Promise<Auction[]> {
    return this.auctionModel
      .find({
        $or: [
          { status: 'active', endTime: { $lt: new Date() } },
          { status: 'expired' },
        ],
      })
      .populate('car')
      .populate('currentBid')
      .populate('bids')
      .exec();
  }
}
