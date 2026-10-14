import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionsService } from '../../payments/subscriptions.service';
import { PlanTier } from '../../payments/entities/plan.entity';

export const MIN_TIER_KEY = 'min_tier';
export const RequireTier = (tier: PlanTier) => (target: object, key?: string | symbol, descriptor?: any) => {
  Reflector.createDecorator<PlanTier>()(MIN_TIER_KEY)(tier)(target, key, descriptor);
};

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTier = this.reflector.getAllAndOverride<PlanTier>(MIN_TIER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredTier || requiredTier === PlanTier.FREE) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userTier = await this.subscriptionsService.getTier(user.id);

    const tierHierarchy = {
      [PlanTier.FREE]: 0,
      [PlanTier.PREMIUM]: 1,
      [PlanTier.VIP]: 2,
    };

    if (tierHierarchy[userTier] < tierHierarchy[requiredTier]) {
      throw new ForbiddenException(`This feature requires a ${requiredTier} subscription`);
    }

    return true;
  }
}
