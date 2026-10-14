import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Match } from './entities/match.entity';
import { User } from '../users/entities/user.entity';
import { LikeType } from './enums/like-type.enum';
import { ChatService } from '../chat/chat.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private chatService: ChatService,
    private notificationsService: NotificationsService,
  ) {}

  async createLike(fromUser: User, toUserId: string, type: LikeType): Promise<{ like: Like; match?: Match }> {
    if (fromUser.id === toUserId) {
      throw new ConflictException('You cannot like yourself');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { fromUser: { id: fromUser.id }, toUser: { id: toUserId } },
    });

    if (existingLike) {
      existingLike.type = type;
      await this.likesRepository.save(existingLike);
      return { like: existingLike };
    }

    const like = this.likesRepository.create({
      fromUser,
      toUser: { id: toUserId } as User,
      type,
    });
    await this.likesRepository.save(like);

    // Check for mutual like
    if (type === LikeType.LIKE || type === LikeType.SUPERLIKE) {
      const mutualLike = await this.likesRepository.findOne({
        where: {
          fromUser: { id: toUserId },
          toUser: { id: fromUser.id },
          type: LikeType.LIKE, // Or SUPERLIKE
        },
      });

      if (mutualLike) {
        const match = await this.createMatch(fromUser.id, toUserId);
        await this.chatService.createConversation(fromUser.id, toUserId, match);

        // Notify both users
        await this.notificationsService.sendNotification({
          user: fromUser,
          type: NotificationType.NEW_MATCH,
          title: "It's a Match!",
          body: "You have a new match!",
          payload: { matchId: match.id },
        });

        await this.notificationsService.sendNotification({
          user: { id: toUserId } as User,
          type: NotificationType.NEW_MATCH,
          title: "It's a Match!",
          body: "You have a new match!",
          payload: { matchId: match.id },
        });

        return { like, match };
      }
    }

    return { like };
  }

  private async createMatch(userOneId: string, userTwoId: string): Promise<Match> {
    const existingMatch = await this.matchesRepository.findOne({
      where: [
        { userOne: { id: userOneId }, userTwo: { id: userTwoId } },
        { userOne: { id: userTwoId }, userTwo: { id: userOneId } },
      ],
    });

    if (existingMatch) return existingMatch;

    const match = this.matchesRepository.create({
      userOne: { id: userOneId } as User,
      userTwo: { id: userTwoId } as User,
    });
    return this.matchesRepository.save(match);
  }

  async getSwipedUserIds(userId: string): Promise<string[]> {
    const likes = await this.likesRepository.find({
      where: { fromUser: { id: userId } },
      select: ['toUser'],
      relations: ['toUser'],
    });
    return likes.map((l) => l.toUser.id);
  }

  async getLikesReceived(userId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { toUser: { id: userId }, type: LikeType.LIKE },
      relations: ['fromUser', 'fromUser.profile', 'fromUser.photos'],
      order: { createdAt: 'DESC' },
    });
  }
}
