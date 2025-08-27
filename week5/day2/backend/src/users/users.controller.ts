/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findPublicById(id);
  }

  // Toggle follow/unfollow
  @UseGuards(AuthGuard('jwt'))
  @Post('follow/:id')
  async toggleFollow(@Req() req: any, @Param('id') targetId: string) {
    const userId = req.user.userId; // use `userId` from JWT payload
    console.log('Logged-in user:', userId, 'Target user:', targetId);
    return this.usersService.follow(userId, targetId);
  }
}
