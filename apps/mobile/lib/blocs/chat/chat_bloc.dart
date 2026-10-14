import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/repositories/chat_repository.dart';
import 'package:mobile/core/services/socket_service.dart';
import 'chat_event.dart';
import 'chat_state.dart';
import 'package:mobile/models/chat_models.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ChatRepository chatRepository;
  final SocketService socketService;

  ChatBloc({required this.chatRepository, required this.socketService}) : super(ChatInitial()) {
    on<LoadConversations>(_onLoadConversations);
    on<LoadMessages>(_onLoadMessages);
    on<SendMessage>(_onSendMessage);
    on<ReceiveMessage>(_onReceiveMessage);
    on<UpdateTypingStatus>(_onUpdateTypingStatus);

    socketService.messages.listen((data) {
      add(ReceiveMessage(MessageModel.fromJson(data)));
    });

    socketService.typingEvents.listen((data) {
      add(UpdateTypingStatus(data['userId'], data['isTyping']));
    });
  }

  Future<void> _onLoadConversations(LoadConversations event, Emitter<ChatState> emit) async {
    emit(ChatLoading());
    try {
      final conversations = await chatRepository.getConversations();
      emit(ConversationsLoaded(conversations));
    } catch (e) {
      emit(ChatError(e.toString()));
    }
  }

  Future<void> _onLoadMessages(LoadMessages event, Emitter<ChatState> emit) async {
    emit(ChatLoading());
    try {
      final messages = await chatRepository.getMessages(event.conversationId);
      socketService.joinRoom(event.conversationId);
      emit(MessagesLoaded(messages));
    } catch (e) {
      emit(ChatError(e.toString()));
    }
  }

  void _onSendMessage(SendMessage event, Emitter<ChatState> emit) {
    socketService.sendMessage(event.conversationId, event.content);
  }

  void _onReceiveMessage(ReceiveMessage event, Emitter<ChatState> emit) {
    if (state is MessagesLoaded) {
      final currentState = state as MessagesLoaded;
      emit(MessagesLoaded([event.message, ...currentState.messages]));
    }
  }

  void _onUpdateTypingStatus(UpdateTypingStatus event, Emitter<ChatState> emit) {
    if (state is MessagesLoaded) {
      final currentState = state as MessagesLoaded;
      emit(MessagesLoaded(currentState.messages, isTyping: event.isTyping));
    }
  }
}
