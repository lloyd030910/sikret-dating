import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/repositories/auth_repository.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    try {
      final authRepo = sl<AuthRepository>();
      final result = await authRepo.login(_emailController.text, _passwordController.text);
      await authRepo.saveToken(result['access_token']);
      if (mounted) context.go('/');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login failed. Please check your credentials.')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Welcome Back', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Login to continue your journey', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 48),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(hintText: 'Email'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(hintText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _isLoading ? null : _handleLogin,
              child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Login'),
            ),
            const SizedBox(height: 16),
            Center(
              child: TextButton(
                onPressed: () => context.push('/register'),
                child: const Text("Don't have an account? Register"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
