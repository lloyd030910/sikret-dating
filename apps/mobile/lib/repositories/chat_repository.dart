import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/models/chat_models.dart';

class ChatRepository {
  final ApiClient apiClient;

  ChatRepository({required this.apiClient});

  Future<List<ConversationModel>> getConversations() async {
    final response = await apiClient.get('/conversations');
    final List data = response.data;
    return data.map((json) => ConversationModel.fromJson(json)).toList();
  }

  Future<List<MessageModel>> getMessages(String conversationId, {int limit = 50, int offset = 0}) async {
    final response = await apiClient.get('/conversations/$conversationId/messages', queryParameters: {
      'limit': limit,
      'offset': offset,
    });
    final List data = response.data;
    return data.map((json) => MessageModel.fromJson(json)).toList();
  }
}
