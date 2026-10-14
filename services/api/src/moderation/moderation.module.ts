import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Block } from './entities/block.entity';
import { User } from '../users/entities/user.entity';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Block, User]),
    NotificationsModule,
  ],
  providers: [ModerationService],
  controllers: [ModerationController],
  exports: [ModerationService],
})
export class ModerationModule {}
