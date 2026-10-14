import 'package:equatable/equatable.dart';
import 'package:mobile/models/profile_model.dart';

enum MessageType { TEXT, IMAGE }
enum MessageStatus { SENT, DELIVERED, READ }

class MessageModel extends Equatable {
  final String id;
  final String content;
  final MessageType type;
  final MessageStatus status;
  final DateTime createdAt;
  final String senderId;

  const MessageModel({
    required this.id,
    required this.content,
    required this.type,
    required this.status,
    required this.createdAt,
    required this.senderId,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'],
      content: json['content'],
      type: json['type'] == 'IMAGE' ? MessageType.IMAGE : MessageType.TEXT,
      status: _parseStatus(json['status']),
      createdAt: DateTime.parse(json['createdAt']),
      senderId: json['sender']['id'],
    );
  }

  static MessageStatus _parseStatus(String? status) {
    switch (status) {
      case 'DELIVERED': return MessageStatus.DELIVERED;
      case 'READ': return MessageStatus.READ;
      default: return MessageStatus.SENT;
    }
  }

  @override
  List<Object?> get props => [id, content, type, status, createdAt, senderId];
}

class ConversationModel extends Equatable {
  final String id;
  final DateTime updatedAt;
  final List<ProfileModel> participants;
  final List<MessageModel> messages;

  const ConversationModel({
    required this.id,
    required this.updatedAt,
    required this.participants,
    required this.messages,
  });

  factory ConversationModel.fromJson(Map<String, dynamic> json) {
    return ConversationModel(
      id: json['id'],
      updatedAt: DateTime.parse(json['updatedAt']),
      participants: (json['participants'] as List)
          .map((p) => ProfileModel.fromJson(p))
          .toList(),
      messages: (json['messages'] as List?)
          ?.map((m) => MessageModel.fromJson(m))
          .toList() ?? [],
    );
  }

  ProfileModel getOtherParticipant(String currentUserId) {
    return participants.firstWhere((p) => p.id != currentUserId);
  }

  MessageModel? get lastMessage => messages.isNotEmpty ? messages.first : null;

  @override
  List<Object?> get props => [id, updatedAt, participants, messages];
}
