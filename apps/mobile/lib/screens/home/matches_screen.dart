import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/blocs/chat/chat_bloc.dart';
import 'package:mobile/blocs/chat/chat_event.dart';
import 'package:mobile/blocs/chat/chat_state.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';

class MatchesScreen extends StatelessWidget {
  const MatchesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ChatBloc, ChatState>(
      builder: (context, state) {
        if (state is ChatLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is ConversationsLoaded) {
          if (state.conversations.isEmpty) {
            return const Center(child: Text('No matches yet. Keep swiping!'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: state.conversations.length,
            separatorBuilder: (context, index) => const Divider(),
            itemBuilder: (context, index) {
              final conversation = state.conversations[index];
              // Assuming we have access to current user ID to identify 'other' participant
              // For now, take the first one that isn't empty
              final otherParticipant = conversation.participants.first;

              return ListTile(
                leading: CircleAvatar(
                  radius: 30,
                  backgroundImage: CachedNetworkImageProvider(otherParticipant.mainPhotoUrl),
                ),
                title: Text(
                  otherParticipant.displayName,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                subtitle: Text(
                  conversation.lastMessage?.content ?? 'New Match! Say hello.',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                onTap: () => context.push('/chat/${conversation.id}/${otherParticipant.displayName}'),
              );
            },
          );
        }

        return const SizedBox();
      },
    );
  }
}
