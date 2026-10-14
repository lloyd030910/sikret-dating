import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageStatus, MessageType } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Match } from '../likes/entities/match.entity';
import { ModerationService } from '../moderation/moderation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private moderationService: ModerationService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async createConversation(userOneId: string, userTwoId: string, match?: Match): Promise<Conversation> {
    const existing = await this.conversationRepository.createQueryBuilder('conv')
      .innerJoin('conv.participants', 'part')
      .where('part.id IN (:...ids)', { ids: [userOneId, userTwoId] })
      .groupBy('conv.id')
      .having('COUNT(part.id) = 2')
      .getOne();

    if (existing) return existing;

    const conversation = this.conversationRepository.create({
      participants: [{ id: userOneId } as User, { id: userTwoId } as User],
      match,
    });
    return this.conversationRepository.save(conversation);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { participants: { id: userId } },
      relations: ['participants', 'messages'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getMessages(conversationId: string, userId: string, limit = 50, offset = 0): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) throw new NotFoundException('Conversation not found');
    if (!conversation.participants.some(p => p.id === userId)) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async saveMessage(conversationId: string, senderId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const recipient = conversation.participants.find(p => p.id !== senderId);
    if (recipient) {
      const isBlocked = await this.moderationService.isBlocked(senderId, recipient.id);
      if (isBlocked) throw new ForbiddenException('User is blocked');
    }

    const message = this.messageRepository.create({
      conversation: { id: conversationId } as Conversation,
      sender: { id: senderId } as User,
      content,
      type,
    });
    const saved = await this.messageRepository.save(message);
    await this.conversationRepository.update(conversationId, { updatedAt: new Date() });

    // Send notification to recipient
    if (recipient) {
      await this.notificationsService.sendNotification({
        user: recipient,
        type: NotificationType.NEW_MESSAGE,
        title: 'New Message',
        body: content.length > 50 ? content.substring(0, 47) + '...' : content,
        payload: { conversationId, messageId: saved.id },
      });
    }

    return saved;
  }

  async markAsRead(messageIds: string[], userId: string): Promise<void> {
    await this.messageRepository.update(messageIds, { status: MessageStatus.READ });
  }
}
