import { Controller, Post, Get, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SubscriptionGuard, MIN_TIER_KEY } from '../common/guards/subscription.guard';
import { PlanTier } from '../payments/entities/plan.entity';
import { LikesService } from './likes.service';
import { LikeType } from './enums/like-type.enum';
import { IsEnum, IsUUID } from 'class-validator';

class CreateLikeDto {
  @ApiProperty()
  @IsUUID()
  toUserId: string;

  @ApiProperty({ enum: LikeType })
  @IsEnum(LikeType)
  type: LikeType;
}

@ApiTags('Likes & Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: 'Like or Pass a user' })
  async createLike(@Req() req, @Body() createLikeDto: CreateLikeDto) {
    return this.likesService.createLike(req.user, createLikeDto.toUserId, createLikeDto.type);
  }

  @Get('received')
  @UseGuards(SubscriptionGuard)
  @SetMetadata(MIN_TIER_KEY, PlanTier.PREMIUM)
  @ApiOperation({ summary: 'See who liked you (Premium only)' })
  async getLikesReceived(@Req() req) {
    return this.likesService.getLikesReceived(req.user.id);
  }
}
