/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async register({ username, email, password, bio }: any) {
    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({
      username,
      email,
      password: hashed,
      bio,
    });
    await created.save();

    const u = created.toObject() as Record<string, any>;
    delete u.password;

    return u;
  }

  async login({ email, password }: any) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: (user._id as any).toString(),
      username: user.username,
    };

    return {
      access_token: this.jwt.sign(payload),
      user: { id: user._id, username: user.username, email: user.email },
    };
  }
}
