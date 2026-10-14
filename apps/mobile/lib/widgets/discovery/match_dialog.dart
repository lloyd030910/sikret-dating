import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile/models/profile_model.dart';

class MatchDialog extends StatelessWidget {
  final ProfileModel matchedProfile;

  const MatchDialog({super.key, required this.matchedProfile});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "It's a Match!",
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Color(0xFF6366F1),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              "You and ${matchedProfile.displayName} liked each other.",
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            CircleAvatar(
              radius: 80,
              backgroundImage: CachedNetworkImageProvider(matchedProfile.mainPhotoUrl),
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Send a Message'),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Keep Swiping', style: TextStyle(color: Colors.grey)),
            ),
          ],
        ),
      ),
    );
  }
}
