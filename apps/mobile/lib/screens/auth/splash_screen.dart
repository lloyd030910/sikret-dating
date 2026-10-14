import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/repositories/auth_repository.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 2));
    final authRepo = sl<AuthRepository>();
    final isAuth = await authRepo.isAuthenticated();
    if (mounted) {
      context.go(isAuth ? '/' : '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.favorite, size: 80, color: Color(0xFF6366F1)),
            SizedBox(height: 24),
            Text(
              'Dating Platform',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
