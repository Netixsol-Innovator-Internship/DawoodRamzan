/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }

  async addCarToUser(userId: string, carId: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { myCars: carId } },
        { new: true },
      )
      .select('-password')
      .exec();
  }

  async addBidToUser(userId: string, bidId: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { myBids: bidId } },
        { new: true },
      )
      .select('-password')
      .exec();
  }

  async addToWishlist(userId: string, carId: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: carId } },
        { new: true },
      )
      .select('-password')
      .exec();
  }

  async removeFromWishlist(
    userId: string,
    carId: string,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { wishlist: carId } }, { new: true })
      .select('-password')
      .exec();
  }
}
