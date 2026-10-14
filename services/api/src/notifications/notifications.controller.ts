import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { IsString, IsOptional } from 'class-validator';

class RegisterTokenDto {
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  platform?: string;
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notification history' })
  async getHistory(@Req() req, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.notificationsService.getHistory(req.user.id, limit, offset);
  }

  @Post('tokens')
  @ApiOperation({ summary: 'Register a device token for push notifications' })
  async registerToken(@Req() req, @Body() dto: RegisterTokenDto) {
    return this.notificationsService.registerToken(req.user, dto.token, dto.platform);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Req() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
