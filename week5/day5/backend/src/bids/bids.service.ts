/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './schemas/bid.schema';
import { CreateBidDto } from './dto/create-bid.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<Bid>,

    // 👇 Use forwardRef to resolve circular dependency
    @Inject(forwardRef(() => AuctionsService))
    private readonly auctionsService: AuctionsService,

    private readonly usersService: UsersService,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const auction = await this.auctionsService.findById(createBidDto.auction);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    // // ✅ Check if auction is still active
    // if (auction.status !== 'active' || new Date() > auction.endTime) {
    //   throw new BadRequestException('Auction is no longer active');
    // }

    // ✅ Optional: Check if bid amount is higher than current highest bid
    const highestBid = await this.findHighestBid(createBidDto.auction);
    if (highestBid && createBidDto.amount <= highestBid.amount) {
      throw new BadRequestException(
        'Bid amount must be higher than current highest bid',
      );
    }

    // ✅ Optional: Check reserve price
    // if (auction.car && createBidDto.amount < auction.car) {
    //   throw new BadRequestException(
    //     'Bid amount must meet or exceed reserve price',
    //   );
    // }

    // ✅ Create & save bid
    const createdBid = new this.bidModel(createBidDto);
    const savedBid = await createdBid.save();

    // ✅ Add bid reference to auction
    await this.auctionsService.addBidToAuction(
      createBidDto.auction,
      savedBid._id.toString(),
    );

    // ✅ Add bid reference to user
    await this.usersService.addBidToUser(
      createBidDto.bidder,
      savedBid._id.toString(),
    );

    return savedBid.populate(['auction', 'bidder']);
  }

  async findAll(): Promise<Bid[]> {
    return this.bidModel.find().populate('auction').populate('bidder').exec();
  }

  async findById(id: string): Promise<Bid> {
    const bid = await this.bidModel
      .findById(id)
      .populate('auction')
      .populate('bidder')
      .exec();

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }
    return bid;
  }

  async findByAuction(auctionId: string): Promise<Bid[]> {
    return this.bidModel.find({ auction: auctionId }).populate('bidder').exec();
  }

  async findByUser(userId: string): Promise<Bid[]> {
    return this.bidModel.find({ bidder: userId }).populate('auction').exec();
  }

  async findHighestBid(auctionId: string): Promise<Bid | null> {
    return this.bidModel
      .findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate('bidder')
      .exec();
  }

  async remove(id: string): Promise<Bid> {
    const deletedBid = await this.bidModel.findByIdAndDelete(id).exec();
    if (!deletedBid) {
      throw new NotFoundException('Bid not found');
    }
    return deletedBid;
  }
}
