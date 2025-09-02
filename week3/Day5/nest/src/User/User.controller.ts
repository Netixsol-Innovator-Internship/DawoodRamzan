/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './User.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------- Auth Routes ----------
  @Post('signup')
  async signup(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ) {
    return this.authService.signup(name, email, password, role);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  // ---------- User Management ----------
  @Get('all-users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Put('update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('role') role?: string,
    @Body('blocked') blocked?: boolean,
  ) {
    return this.authService.updateUser(id, role, blocked);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  // ---------- Profile & Protected Routes ----------
  @Get('profile')
  @UseGuards(JwtAuthGuard) // ✅ protect profile route
  async getProfile(@Req() req: any) {
    return this.authService.getUserProfile(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) // ✅ only logged-in users
  getMe(@Req() req: any) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ only admins & super admins
  adminOnlyRoute() {
    return { message: 'Welcome Admin or Super Admin!' };
  }
}
