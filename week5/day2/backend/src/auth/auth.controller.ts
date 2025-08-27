import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  async register(@Body() body: any) {
    return this.auth.register(body);
  }
  @Post('login')
  async login(@Body() body: any) {
    return this.auth.login(body);
  }
}
