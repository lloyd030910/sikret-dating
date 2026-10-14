import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    role: UserRole.MEMBER,
    status: UserStatus.ACTIVE,
    profile: { displayName: 'Test User' },
  };

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens on valid credentials', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await service.login({ email: 'test@example.com', password: 'password' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
    });
  });
});
