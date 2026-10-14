import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:mobile/screens/home/discovery_screen.dart';
import 'package:mobile/screens/home/matches_screen.dart';
import 'package:mobile/screens/home/profile_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DiscoveryScreen(),
    const MatchesScreen(),
    const ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_selectedIndex == 0 ? 'Discover' : _selectedIndex == 1 ? 'Matches' : 'Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await sl<AuthRepository>().logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: 'Discover'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Matches'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
