import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:async';

class SocketService {
  final FlutterSecureStorage storage;
  IO.Socket? _socket;

  final _messageController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get messages => _messageController.stream;

  final _typingController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get typingEvents => _typingController.stream;

  SocketService({required this.storage});

  Future<void> connect() async {
    final token = await storage.read(key: 'auth_token');
    if (token == null) return;

    _socket = IO.io('http://10.0.2.2:3000', IO.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': token})
      .build());

    _socket!.onConnect((_) => print('Connected to WebSocket'));
    _socket!.onDisconnect((_) => print('Disconnected from WebSocket'));

    _socket!.on('new_message', (data) => _messageController.add(data));
    _socket!.on('typing', (data) => _typingController.add(data));
  }

  void joinRoom(String conversationId) {
    _socket?.emit('join_room', conversationId);
  }

  void leaveRoom(String conversationId) {
    _socket?.emit('leave_room', conversationId);
  }

  void sendMessage(String conversationId, String content) {
    _socket?.emit('send_message', {
      'conversationId': conversationId,
      'content': content,
    });
  }

  void sendTyping(String conversationId, bool isTyping) {
    _socket?.emit('typing', {
      'conversationId': conversationId,
      'isTyping': isTyping,
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
