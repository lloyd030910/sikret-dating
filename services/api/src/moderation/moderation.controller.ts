import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ModerationService } from './moderation.service';
import { ReportType, ReportStatus } from './entities/report.entity';
import { IsEnum, IsUUID, IsString, IsOptional } from 'class-validator';

class CreateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  targetType: ReportType;

  @ApiProperty()
  @IsUUID()
  targetId: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  targetUserId?: string;
}

class ResolveReportDto {
  @ApiProperty({ enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: ['BAN', 'SUSPEND', 'NONE'], required: false })
  @IsOptional()
  @IsEnum(['BAN', 'SUSPEND', 'NONE'])
  action?: 'BAN' | 'SUSPEND' | 'NONE';
}

@ApiTags('Moderation & Safety')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('report')
  @ApiOperation({ summary: 'Report a user or content' })
  async report(@Req() req, @Body() dto: CreateReportDto) {
    return this.moderationService.createReport(req.user, dto);
  }

  @Post('block/:userId')
  @ApiOperation({ summary: 'Block a user' })
  async block(@Req() req, @Param('userId') userId: string) {
    return this.moderationService.blockUser(req.user, userId);
  }

  @Post('unblock/:userId')
  @ApiOperation({ summary: 'Unblock a user' })
  async unblock(@Req() req, @Param('userId') userId: string) {
    return this.moderationService.unblockUser(req.user.id, userId);
  }

  @Get('reports')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all reports (Admin only)' })
  async getReports(@Query('status') status?: ReportStatus) {
    return this.moderationService.getReports(status);
  }

  @Patch('reports/:id/resolve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Resolve a report (Admin only)' })
  async resolve(@Req() req, @Param('id') id: string, @Body() dto: ResolveReportDto) {
    return this.moderationService.resolveReport(id, req.user, dto);
  }
}
