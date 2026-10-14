import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DiscoveryService } from './discovery.service';
import { DiscoveryController } from './discovery.controller';
import { LikesModule } from '../likes/likes.module';
import { ModerationModule } from '../moderation/moderation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LikesModule,
    ModerationModule,
  ],
  providers: [DiscoveryService],
  controllers: [DiscoveryController],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
