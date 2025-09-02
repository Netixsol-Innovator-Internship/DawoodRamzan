/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<Car>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const createdCar = new this.carModel(createCarDto);
    return createdCar.save();
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().populate('category').exec();
  }

  async findById(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).populate('category').exec();
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async findByCategory(categoryId: string): Promise<Car[]> {
    return this.carModel
      .find({ category: categoryId })
      .populate('category')
      .exec();
  }

  async findByUser(userId: string): Promise<Car[]> {
    return this.carModel.find({ owner: userId }).populate('category').exec();
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const updatedCar = await this.carModel
      .findByIdAndUpdate(id, updateCarDto, { new: true })
      .populate('category')
      .exec();
    if (!updatedCar) {
      throw new NotFoundException('Car not found');
    }
    return updatedCar;
  }

  async remove(id: string): Promise<Car> {
    const deletedCar = await this.carModel.findByIdAndDelete(id).exec();
    if (!deletedCar) {
      throw new NotFoundException('Car not found');
    }
    return deletedCar;
  }

  async searchCars(filters: any): Promise<Car[]> {
    const query: any = {};

    if (filters.make) query.make = { $regex: filters.make, $options: 'i' };
    if (filters.model) query.model = { $regex: filters.model, $options: 'i' };
    if (filters.year) query.year = filters.year;
    if (filters.category) query.category = filters.category;
    if (filters.minPrice || filters.maxPrice) {
      query.currentPrice = {};
      if (filters.minPrice) query.currentPrice.$gte = filters.minPrice;
      if (filters.maxPrice) query.currentPrice.$lte = filters.maxPrice;
    }

    return this.carModel.find(query).populate('category').exec();
  }
}
