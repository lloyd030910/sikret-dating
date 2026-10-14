import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ActingAsInterceptor } from '../common/interceptors/acting-as.interceptor';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ActingAsInterceptor)
@Controller('conversations')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiHeader({ name: 'x-acting-as-model', required: false, description: 'Model ID for Employee to act as' })
  @ApiOperation({ summary: 'Get list of conversations' })
  async getConversations(@Req() req) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getMessages(
    @Req() req,
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.chatService.getMessages(id, req.user.id, limit, offset);
  }
}
