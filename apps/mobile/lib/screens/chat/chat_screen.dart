import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/blocs/chat/chat_bloc.dart';
import 'package:mobile/blocs/chat/chat_event.dart';
import 'package:mobile/blocs/chat/chat_state.dart';

class ChatScreen extends StatefulWidget {
  final String conversationId;
  final String title;

  const ChatScreen({super.key, required this.conversationId, required this.title});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<ChatBloc>().add(LoadMessages(widget.conversationId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Column(
        children: [
          Expanded(
            child: BlocBuilder<ChatBloc, ChatState>(
              builder: (context, state) {
                if (state is ChatLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (state is MessagesLoaded) {
                  return ListView.builder(
                    reverse: true,
                    padding: const EdgeInsets.all(16),
                    itemCount: state.messages.length,
                    itemBuilder: (context, index) {
                      final message = state.messages[index];
                      // Simple distinction for UI - real app needs userId check
                      final isMe = index % 2 == 0;

                      return Align(
                        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: isMe ? const Color(0xFF6366F1) : Colors.grey[200],
                            borderRadius: BorderRadius.circular(20).copyWith(
                              bottomRight: isMe ? const Radius.circular(0) : null,
                              bottomLeft: !isMe ? const Radius.circular(0) : null,
                            ),
                          ),
                          child: Text(
                            message.content,
                            style: TextStyle(color: isMe ? Colors.white : Colors.black87),
                          ),
                        ),
                      );
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),

          // Typing Indicator
          BlocBuilder<ChatBloc, ChatState>(
            builder: (context, state) {
              if (state is MessagesLoaded && state.isTyping) {
                return const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('Match is typing...', style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey)),
                );
              }
              return const SizedBox();
            },
          ),

          // Input Area
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      contentPadding: EdgeInsets.symmetric(horizontal: 20),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                IconButton(
                  onPressed: () {
                    if (_messageController.text.isNotEmpty) {
                      context.read<ChatBloc>().add(SendMessage(widget.conversationId, _messageController.text));
                      _messageController.clear();
                    }
                  },
                  icon: const Icon(Icons.send, color: Color(0xFF6366F1)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
