import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ModerationModule } from '../moderation/moderation.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { ModelsModule } from '../models/models.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    ModerationModule,
    forwardRef(() => NotificationsModule),
    AuditModule,
    ModelsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
