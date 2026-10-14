import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { DeviceToken } from './entities/device-token.entity';
import { User } from '../users/entities/user.entity';
import * as admin from 'firebase-admin';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {
    // Initialize Firebase Admin if credential file exists
    // In a real app, you would use ConfigService to load the path
    try {
      if (admin.apps.length === 0) {
        // admin.initializeApp({
        //   credential: admin.credential.cert(process.env.FIREBASE_CONFIG_PATH),
        // });
      }
    } catch (error) {
      this.logger.warn('Firebase Admin not initialized. Push notifications will be disabled.');
    }
  }

  async sendNotification(data: {
    user: User;
    type: NotificationType;
    title: string;
    body: string;
    payload?: any;
  }) {
    // 1. Persist to DB
    const notification = this.notificationRepository.create(data);
    const saved = await this.notificationRepository.save(notification);

    // 2. Send in-app real-time notification
    this.chatGateway.server.to(`user_${data.user.id}`).emit('notification', saved);

    // 3. Send Push Notification
    await this.sendPushNotification(data.user.id, data.title, data.body, data.payload);

    return saved;
  }

  private async sendPushNotification(userId: string, title: string, body: string, payload?: any) {
    const tokens = await this.deviceTokenRepository.find({
      where: { user: { id: userId } },
    });

    if (tokens.length === 0) return;

    const fcmTokens = tokens.map(t => t.token);

    // Mock push sending
    this.logger.log(`Sending push notification to ${fcmTokens.length} devices for user ${userId}`);

    // In production:
    // try {
    //   await admin.messaging().sendEachForMulticast({
    //     tokens: fcmTokens,
    //     notification: { title, body },
    //     data: payload ? { data: JSON.stringify(payload) } : {},
    //   });
    // } catch (error) {
    //   this.logger.error('Error sending push notification', error);
    // }
  }

  async registerToken(user: User, token: string, platform?: string) {
    const existing = await this.deviceTokenRepository.findOne({
      where: { token, user: { id: user.id } },
    });

    if (existing) {
      existing.updatedAt = new Date();
      return this.deviceTokenRepository.save(existing);
    }

    const deviceToken = this.deviceTokenRepository.create({
      token,
      platform,
      user,
    });
    return this.deviceTokenRepository.save(deviceToken);
  }

  async getHistory(userId: string, limit = 20, offset = 0) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationRepository.update({ id, user: { id: userId } }, { isRead: true });
  }
}
