/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.gaurd';
import { RolesGuard } from '../auth/roles.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.paymentsService.findAll(req.user.userId, isAdmin);
  }

  @Post(':id/confirm')
  async confirmPayment(@Param('id') id: string, @Request() req) {
    return this.paymentsService.confirm(id, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.paymentsService.findOne(id, req.user.userId, isAdmin);
  }
}
