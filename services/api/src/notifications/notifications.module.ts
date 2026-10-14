import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { DeviceToken } from './entities/device-token.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, DeviceToken]),
    forwardRef(() => ChatModule),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
