import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from './discovery.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LikesService } from '../likes/likes.service';
import { ModerationService } from '../moderation/moderation.service';

describe('DiscoveryService', () => {
  let service: DiscoveryService;
  let likesService: Partial<LikesService>;

  beforeEach(async () => {
    likesService = {
      getSwipedUserIds: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveryService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        { provide: LikesService, useValue: likesService },
        {
          provide: ModerationService,
          useValue: {
            getBlockedUserIds: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<DiscoveryService>(DiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
