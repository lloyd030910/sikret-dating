import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/blocs/profile/profile_bloc.dart';
import 'package:mobile/blocs/profile/profile_state.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        if (state is ProfileLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is ProfileLoaded) {
          final profile = state.profile;
          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 40),
                Center(
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 75,
                        backgroundImage: CachedNetworkImageProvider(profile.mainPhotoUrl),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          decoration: const BoxDecoration(
                            color: Color(0xFF6366F1),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.edit, color: Colors.white),
                            onPressed: () => context.push('/profile/edit'),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  '${profile.displayName}, ${profile.age}',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 40),
                _buildMenuItem(
                  context,
                  icon: Icons.settings,
                  title: 'Settings',
                  onTap: () => context.push('/profile/settings'),
                ),
                _buildMenuItem(
                  context,
                  icon: Icons.tune,
                  title: 'Discovery Preferences',
                  onTap: () => context.push('/profile/preferences'),
                ),
                _buildMenuItem(
                  context,
                  icon: Icons.help_outline,
                  title: 'Help & Support',
                  onTap: () {},
                ),
                _buildMenuItem(
                  context,
                  icon: Icons.info_outline,
                  title: 'Safety & Privacy',
                  onTap: () {},
                ),
              ],
            ),
          );
        }

        return const SizedBox();
      },
    );
  }

  Widget _buildMenuItem(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[700]),
      title: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
