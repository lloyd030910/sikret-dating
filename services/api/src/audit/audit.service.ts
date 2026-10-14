import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    actor: User;
    action: string;
    targetUser?: User;
    payload?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const logEntry = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(logEntry);
  }

  async getLogs(options: {
    actorId?: string;
    targetUserId?: string;
    limit?: number;
    offset?: number;
  }): Promise<[AuditLog[], number]> {
    return this.auditLogRepository.findAndCount({
      where: {
        actor: options.actorId ? { id: options.actorId } : undefined,
        targetUser: options.targetUserId ? { id: options.targetUserId } : undefined,
      },
      relations: ['actor', 'targetUser'],
      order: { createdAt: 'DESC' },
      take: options.limit || 50,
      skip: options.offset || 0,
    });
  }
}
