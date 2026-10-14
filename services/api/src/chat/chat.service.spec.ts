import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ModerationService } from '../moderation/moderation.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Message),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ModerationService,
          useValue: {
            isBlocked: jest.fn().mockResolvedValue(false),
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

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
