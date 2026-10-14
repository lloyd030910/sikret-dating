import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/repositories/auth_repository.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleRegister() async {
    setState(() => _isLoading = true);
    try {
      final authRepo = sl<AuthRepository>();
      final result = await authRepo.register(
        _emailController.text,
        _passwordController.text,
        _nameController.text,
      );
      await authRepo.saveToken(result['access_token']);
      if (mounted) context.go('/');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration failed.')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Create Account', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Join the community today', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 48),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(hintText: 'Display Name'),
              ),
              const SizedBox(height: 16),
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
                onPressed: _isLoading ? null : _handleRegister,
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Register'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
