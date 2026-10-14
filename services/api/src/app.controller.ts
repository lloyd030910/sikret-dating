import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { UserRole } from './users/enums/user-role.enum';

@ApiTags('Health & Admin')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Get('admin/ping')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin only ping' })
  @ApiResponse({ status: 200, description: 'Admin ping successful' })
  adminPing(): string {
    return 'Admin Pong';
  }
}
