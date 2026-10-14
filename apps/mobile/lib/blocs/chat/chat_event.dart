import 'package:equatable/equatable.dart';
import 'package:mobile/models/chat_models.dart';

abstract class ChatEvent extends Equatable {
  const ChatEvent();
  @override
  List<Object?> get props => [];
}

class LoadConversations extends ChatEvent {}

class LoadMessages extends ChatEvent {
  final String conversationId;
  const LoadMessages(this.conversationId);
  @override
  List<Object?> get props => [conversationId];
}

class SendMessage extends ChatEvent {
  final String conversationId;
  final String content;
  const SendMessage(this.conversationId, this.content);
  @override
  List<Object?> get props => [conversationId, content];
}

class ReceiveMessage extends ChatEvent {
  final MessageModel message;
  const ReceiveMessage(this.message);
  @override
  List<Object?> get props => [message];
}

class UpdateTypingStatus extends ChatEvent {
  final String userId;
  final bool isTyping;
  const UpdateTypingStatus(this.userId, this.isTyping);
  @override
  List<Object?> get props => [userId, isTyping];
}
