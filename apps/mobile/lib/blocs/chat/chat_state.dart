import 'package:equatable/equatable.dart';
import 'package:mobile/models/chat_models.dart';

abstract class ChatState extends Equatable {
  const ChatState();
  @override
  List<Object?> get props => [];
}

class ChatInitial extends ChatState {}

class ChatLoading extends ChatState {}

class ConversationsLoaded extends ChatState {
  final List<ConversationModel> conversations;
  const ConversationsLoaded(this.conversations);
  @override
  List<Object?> get props => [conversations];
}

class MessagesLoaded extends ChatState {
  final List<MessageModel> messages;
  final bool isTyping;
  const MessagesLoaded(this.messages, {this.isTyping = false});
  @override
  List<Object?> get props => [messages, isTyping];
}

class ChatError extends ChatState {
  final String message;
  const ChatError(this.message);
  @override
  List<Object?> get props => [message];
}
