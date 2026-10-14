import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentProvider } from './entities/payment.entity';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { Plan, PlanTier } from './entities/plan.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async getPlans(): Promise<Plan[]> {
    return this.planRepository.find({ where: { isActive: true } });
  }

  async createCheckoutSession(user: User, planId: string, provider: PaymentProvider) {
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) throw new BadRequestException('Plan not found');

    // Create a pending payment record
    const payment = this.paymentRepository.create({
      user,
      amount: plan.price,
      currency: plan.currency,
      provider,
      status: PaymentStatus.PENDING,
    });
    const savedPayment = await this.paymentRepository.save(payment);

    // In a real implementation, you would call the provider's API here
    // e.g., Stripe checkout.sessions.create()

    return {
      paymentId: savedPayment.id,
      checkoutUrl: `https://checkout.example.com/${provider}/${savedPayment.id}`, // Mock URL
      message: 'Proceed to payment',
    };
  }

  async handleWebhook(provider: PaymentProvider, data: any) {
    // Logic to handle async payment updates from providers
    // For MOCK/DEMO purposes:
    const { paymentId, success } = data;

    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user']
    });

    if (!payment) return;

    if (success) {
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentRepository.save(payment);

      // Update subscription
      // Note: We'd need to know which plan was being purchased.
      // In a real app, this data is in the provider's metadata.
    } else {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
    }
  }
}
