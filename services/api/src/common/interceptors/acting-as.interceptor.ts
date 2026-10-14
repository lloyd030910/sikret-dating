import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';
import { ModelsService } from '../../models/models.service';
import { UserRole } from '../../users/enums/user-role.enum';

@Injectable()
export class ActingAsInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private modelsService: ModelsService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const actingAsId = request.headers['x-acting-as-model'];

    if (actingAsId && request.user.role === UserRole.EMPLOYEE) {
      const isAssigned = await this.modelsService.isAssigned(request.user.id, actingAsId);
      if (!isAssigned) {
        throw new ForbiddenException('You are not authorized to act as this model');
      }

      // Store original user for auditing
      request.realUser = request.user;

      // Swap user to model for business logic
      // Note: In a real app, you might want to fetch the full model user object
      request.user = { id: actingAsId, role: UserRole.MODEL };

      return next.handle().pipe(
        tap(() => {
          this.auditService.log({
            actor: request.realUser,
            action: `${context.getClass().name}.${context.getHandler().name}`,
            targetUser: { id: actingAsId } as any,
            payload: {
              path: request.url,
              method: request.method,
            },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }),
      );
    }

    return next.handle();
  }
}
