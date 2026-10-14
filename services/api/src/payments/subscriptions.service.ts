import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { Plan, PlanTier } from './entities/plan.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
      order: { endDate: 'DESC' },
    });
  }

  async activateSubscription(user: User, plan: Plan): Promise<Subscription> {
    // Cancel existing active subscriptions
    await this.subscriptionRepository.update(
      { user: { id: user.id }, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.CANCELED }
    );

    const startDate = new Date();
    const endDate = new Date();

    if (plan.duration === 'MONTHLY') endDate.setMonth(endDate.getMonth() + 1);
    else if (plan.duration === 'YEARLY') endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 100); // Lifetime

    const subscription = this.subscriptionRepository.create({
      user,
      plan,
      startDate,
      endDate,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async getTier(userId: string): Promise<PlanTier> {
    const sub = await this.getUserSubscription(userId);
    return sub ? sub.plan.tier : PlanTier.FREE;
  }
}
