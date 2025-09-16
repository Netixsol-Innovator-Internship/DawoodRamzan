/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ✅ GOOGLE
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: express.Response) {
    const jwt = await this.authService.validateOAuthLogin(req.user);
    return res.redirect(
      `https://dawood-week6.vercel.app/auth/callback?token=${jwt.access_token}&id=${jwt.user.id}&role=${jwt.user.role}`,
    );
  }

  // ✅ GITHUB
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req, @Res() res: express.Response) {
    const jwt = await this.authService.validateOAuthLogin(req.user);
    return res.redirect(
      `https://dawood-week6.vercel.app/auth/callback?token=${jwt.access_token}&id=${jwt.user.id}&role=${jwt.user.role}`,
    );
  }

  // ✅ DISCORD
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req, @Res() res: express.Response) {
    const jwt = await this.authService.validateOAuthLogin(req.user);
    return res.redirect(
      `https://dawood-week6.vercel.app/auth/callback?token=${jwt.access_token}&id=${jwt.user.id}&role=${jwt.user.role}`,
    );
  }
}
