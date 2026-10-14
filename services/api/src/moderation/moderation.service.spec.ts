import { Test, TestingModule } from '@nestjs/testing';
import { ModerationService } from './moderation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Block } from './entities/block.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

describe('ModerationService', () => {
  let service: ModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        {
          provide: getRepositoryToken(Report),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Block),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            update: jest.fn(),
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

    service = module.get<ModerationService>(ModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
