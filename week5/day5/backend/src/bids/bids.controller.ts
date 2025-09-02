/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createBidDto: CreateBidDto, @Req() req) {
    return this.bidsService.create({
      ...createBidDto,
      bidder: req.user._id,
    });
  }

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Get('auction/:auctionId')
  findByAuction(@Param('auctionId') auctionId: string) {
    return this.bidsService.findByAuction(auctionId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bidsService.findByUser(userId);
  }

  @Get('highest/:auctionId')
  findHighest(@Param('auctionId') auctionId: string) {
    return this.bidsService.findHighestBid(auctionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidsService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.bidsService.remove(id);
  }
}
