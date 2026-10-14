import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { MessageType } from './entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException();

      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      // Join a personal room for targeted notifications
      client.join(`user_${payload.sub}`);
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conv_${conversationId}`);
    return { event: 'joined_room', data: conversationId };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.leave(`conv_${conversationId}`);
    return { event: 'left_room', data: conversationId };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; type?: MessageType },
  ) {
    const userId = client.data.user.sub;
    const message = await this.chatService.saveMessage(
      data.conversationId,
      userId,
      data.content,
      data.type || MessageType.TEXT,
    );

    // Broadcast to the conversation room
    this.server.to(`conv_${data.conversationId}`).emit('new_message', message);

    // Also notify participants who are not in the room (optional push notification logic)
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client.to(`conv_${data.conversationId}`).emit('typing', {
      userId: client.data.user.sub,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('read_messages')
  async handleReadMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; messageIds: string[] },
  ) {
    const userId = client.data.user.sub;
    await this.chatService.markAsRead(data.messageIds, userId);

    client.to(`conv_${data.conversationId}`).emit('messages_read', {
      messageIds: data.messageIds,
      userId,
    });
  }
}
