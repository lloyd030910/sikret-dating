import { Controller, Get, Post, Body, UseGuards, Req, Param, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ModelsService } from './models.service';

@ApiTags('Management (Admin & Employee)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('management')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post('assignments')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign a model to an employee' })
  async assign(@Req() req, @Body() data: { employeeId: string; modelId: string }) {
    return this.modelsService.assignModel(req.user, data.employeeId, data.modelId);
  }

  @Get('employee/models')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get assigned models for current employee' })
  async getMyModels(@Req() req) {
    return this.modelsService.getEmployeeModels(req.user.id);
  }
}
