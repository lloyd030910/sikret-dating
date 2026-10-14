import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plan, PlanTier, PlanDuration } from '../payments/entities/plan.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const planRepository = app.get<Repository<Plan>>(getRepositoryToken(Plan));

  const plans = [
    {
      tier: PlanTier.FREE,
      name: 'Free Plan',
      price: 0,
      duration: PlanDuration.LIFETIME,
      features: ['Limited likes', 'Basic discovery'],
    },
    {
      tier: PlanTier.PREMIUM,
      name: 'Premium Member',
      price: 19.99,
      duration: PlanDuration.MONTHLY,
      features: ['Unlimited likes', 'See who liked you', 'Rewind swipes'],
    },
    {
      tier: PlanTier.VIP,
      name: 'VIP Elite',
      price: 49.99,
      duration: PlanDuration.MONTHLY,
      features: ['All Premium features', 'Profile boost', 'Priority matches', 'No ads'],
    },
  ];

  for (const planData of plans) {
    const existing = await planRepository.findOne({ where: { tier: planData.tier as PlanTier } });
    if (!existing) {
      const plan = planRepository.create(planData);
      await planRepository.save(plan);
      console.log(`Created plan: ${planData.name}`);
    }
  }

  console.log('Subscription plans seeded successfully.');
  await app.close();
}

bootstrap();
