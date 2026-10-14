import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { SubscriptionsService } from './subscriptions.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, Payment])],
  providers: [PaymentsService, SubscriptionsService],
  controllers: [PaymentsController],
  exports: [SubscriptionsService],
})
export class PaymentsModule {}
