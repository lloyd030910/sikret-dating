import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Match } from './entities/match.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { ChatModule } from '../chat/chat.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Match]),
    ChatModule,
    NotificationsModule,
    PaymentsModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
