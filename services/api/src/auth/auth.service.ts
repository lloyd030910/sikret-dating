import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE,
      profile: {
        displayName: registerDto.displayName,
      } as any,
    });

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.BANNED || user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is disabled');
    }

    await this.usersService.updateLastLogin(user.id);
    return this.generateTokens(user);
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token: refreshTokenValue,
      user,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);

    return {
      access_token,
      refresh_token: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName,
      },
    };
  }

  async refresh(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user', 'user.profile'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    token.isRevoked = true;
    await this.refreshTokenRepository.save(token);

    return this.generateTokens(token.user);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.update({ token: refreshToken }, { isRevoked: true });
  }
}
