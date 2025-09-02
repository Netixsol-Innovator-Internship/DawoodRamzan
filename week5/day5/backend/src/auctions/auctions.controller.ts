import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.auctionsService.getActiveAuctions();
  }

  @Get('expired')
  findExpired() {
    return this.auctionsService.getExpiredAuctions();
  }

  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    return this.auctionsService.findByCar(carId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(id, updateAuctionDto);
  }

  @Patch(':id/complete')
  @UseGuards(JwtGuard)
  complete(@Param('id') id: string) {
    return this.auctionsService.completeAuction(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.auctionsService.remove(id);
  }
}
