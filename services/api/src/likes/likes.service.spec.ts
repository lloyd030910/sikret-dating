import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Match } from './entities/match.entity';
import { ChatService } from '../chat/chat.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getRepositoryToken(Like),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Match),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ChatService,
          useValue: {
            createConversation: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
