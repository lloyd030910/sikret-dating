import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DiscoveryService } from './discovery.service';

@ApiTags('Discovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get()
  @ApiOperation({ summary: 'Get potential matches' })
  @ApiResponse({ status: 200, description: 'List of potential profiles' })
  async getDiscovery(@Req() req) {
    return this.discoveryService.getDiscoverableProfiles(req.user);
  }
}
