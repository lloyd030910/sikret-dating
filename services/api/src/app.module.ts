import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/typeorm.config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PhotosModule } from './photos/photos.module';
import { LikesModule } from './likes/likes.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ChatModule } from './chat/chat.module';
import { ModelsModule } from './models/models.module';
import { AuditModule } from './audit/audit.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    PhotosModule,
    LikesModule,
    DiscoveryModule,
    ChatModule,
    ModelsModule,
    AuditModule,
    ModerationModule,
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
