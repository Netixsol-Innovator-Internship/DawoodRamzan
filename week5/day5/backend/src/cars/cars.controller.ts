/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createCarDto: CreateCarDto, @Req() req) {
    return this.carsService.create({
      ...createCarDto,
      owner: req.user._id,
    });
  }

  @Get()
  findAll(@Query('category') categoryId?: string) {
    if (categoryId) {
      return this.carsService.findByCategory(categoryId);
    }
    return this.carsService.findAll();
  }

  @Get('search')
  search(@Query() filters: any) {
    return this.carsService.searchCars(filters);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.carsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
