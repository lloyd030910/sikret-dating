import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Report, ReportStatus, ReportType } from './entities/report.entity';
import { Block } from './entities/block.entity';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '../users/enums/user-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async createReport(reporter: User, data: { targetType: ReportType; targetId: string; reason: string; description?: string; targetUserId?: string }): Promise<Report> {
    const report = this.reportRepository.create({
      reporter,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      description: data.description,
      targetUser: data.targetUserId ? { id: data.targetUserId } as User : null,
    });
    return this.reportRepository.save(report);
  }

  async blockUser(blocker: User, blockedId: string): Promise<Block> {
    if (blocker.id === blockedId) {
      throw new ConflictException('You cannot block yourself');
    }

    const existing = await this.blockRepository.findOne({
      where: { blocker: { id: blocker.id }, blocked: { id: blockedId } },
    });

    if (existing) return existing;

    const block = this.blockRepository.create({
      blocker,
      blocked: { id: blockedId } as User,
    });
    return this.blockRepository.save(block);
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepository.delete({
      blocker: { id: blockerId },
      blocked: { id: blockedId },
    });
  }

  async getBlockedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.blockRepository.find({
      where: [{ blocker: { id: userId } }, { blocked: { id: userId } }],
      relations: ['blocker', 'blocked'],
    });

    return blocks.map(b => b.blocker.id === userId ? b.blocked.id : b.blocker.id);
  }

  async isBlocked(userAId: string, userBId: string): Promise<boolean> {
    const count = await this.blockRepository.count({
      where: [
        { blocker: { id: userAId }, blocked: { id: userBId } },
        { blocker: { id: userBId }, blocked: { id: userAId } },
      ],
    });
    return count > 0;
  }

  async getReports(status?: ReportStatus): Promise<Report[]> {
    return this.reportRepository.find({
      where: status ? { status } : {},
      relations: ['reporter', 'targetUser', 'moderator'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolveReport(reportId: string, moderator: User, data: { status: ReportStatus; note?: string; action?: 'BAN' | 'SUSPEND' | 'NONE' }): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id: reportId }, relations: ['targetUser'] });
    if (!report) throw new Error('Report not found');

    report.status = data.status;
    report.moderationNote = data.note;
    report.moderator = moderator;

    if (data.action === 'BAN' && report.targetUser) {
      await this.userRepository.update(report.targetUser.id, { status: UserStatus.BANNED });
      await this.notificationsService.sendNotification({
        user: report.targetUser,
        type: NotificationType.ACCOUNT_UPDATE,
        title: 'Account Update',
        body: 'Your account has been banned due to violation of community guidelines.',
      });
    } else if (data.action === 'SUSPEND' && report.targetUser) {
      await this.userRepository.update(report.targetUser.id, { status: UserStatus.SUSPENDED });
      await this.notificationsService.sendNotification({
        user: report.targetUser,
        type: NotificationType.ACCOUNT_UPDATE,
        title: 'Account Update',
        body: 'Your account has been suspended for review.',
      });
    }

    return this.reportRepository.save(report);
  }
}
