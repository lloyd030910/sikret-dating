import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
}

export enum PlanDuration {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME',
}

@Entity('subscription_plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PlanTier,
    default: PlanTier.FREE,
  })
  tier: PlanTier;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PlanDuration,
    default: PlanDuration.MONTHLY,
  })
  duration: PlanDuration;

  @Column({ type: 'jsonb', nullable: true })
  features: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
