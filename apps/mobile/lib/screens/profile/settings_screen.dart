import 'package:flutter/material.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:go_router/go_router.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const _SettingsSection(title: 'Account Settings'),
          ListTile(
            leading: const Icon(Icons.email_outlined),
            title: const Text('Email'),
            subtitle: const Text('test@example.com'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.phone_outlined),
            title: const Text('Phone Number'),
            subtitle: const Text('+1 234 567 890'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),
          const _SettingsSection(title: 'Legal'),
          ListTile(title: const Text('Privacy Policy'), onTap: () {}),
          ListTile(title: const Text('Terms of Service'), onTap: () {}),
          ListTile(title: const Text('Licenses'), onTap: () {}),
          const Divider(),
          ListTile(
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () async {
              await sl<AuthRepository>().logout();
              if (context.mounted) context.go('/login');
            },
          ),
          ListTile(
            title: const Text('Delete Account', style: TextStyle(color: Colors.red)),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Delete Account?'),
                  content: const Text('This action is permanent and cannot be undone.'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                    TextButton(
                      onPressed: () {}, // Implement delete logic
                      child: const Text('Delete', style: TextStyle(color: Colors.red)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SettingsSection extends StatelessWidget {
  final String title;
  const _SettingsSection({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
      ),
    );
  }
}
