import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from './entities/payment.entity';
import { IsUUID, IsEnum } from 'class-validator';

class CheckoutDto {
  @IsUUID()
  planId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}

@ApiTags('Payments & Subscriptions')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  async getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate a checkout session' })
  async checkout(@Req() req, @Body() dto: CheckoutDto) {
    return this.paymentsService.createCheckoutSession(req.user, dto.planId, dto.provider);
  }

  @Post('webhook/:provider')
  @ApiOperation({ summary: 'Handle payment provider webhooks' })
  async webhook(@Param('provider') provider: PaymentProvider, @Body() data: any) {
    return this.paymentsService.handleWebhook(provider, data);
  }
}
