// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTea, UserTeaDocument } from '../Schema/User.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserTea.name) private userModel: Model<UserTeaDocument>,
  ) {}

  async signup(name: string, email: string, password: string, role?: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.blocked) {
      throw new ForbiddenException('Your account is blocked. Contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'default_secret', // fallback for safety
      { expiresIn: '1d' },
    );

    return {
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  async updateUser(id: string, role?: string, blocked?: boolean) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (role) user.role = role;
    if (typeof blocked === 'boolean') user.blocked = blocked;

    await user.save();
    return { message: 'User updated successfully', user };
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
