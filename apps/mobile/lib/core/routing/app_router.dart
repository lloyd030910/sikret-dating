import 'package:go_router/go_router.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:mobile/screens/auth/login_screen.dart';
import 'package:mobile/screens/auth/register_screen.dart';
import 'package:mobile/screens/auth/splash_screen.dart';
import 'package:mobile/screens/home/home_screen.dart';
import 'package:mobile/screens/chat/chat_screen.dart';
import 'package:mobile/screens/profile/edit_profile_screen.dart';
import 'package:mobile/screens/profile/preferences_screen.dart';
import 'package:mobile/screens/profile/settings_screen.dart';
import 'package:mobile/injection_container.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/chat/:id/:title',
        builder: (context, state) => ChatScreen(
          conversationId: state.pathParameters['id']!,
          title: state.pathParameters['title']!,
        ),
      ),
      GoRoute(
        path: '/profile/edit',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/profile/preferences',
        builder: (context, state) => const PreferencesScreen(),
      ),
      GoRoute(
        path: '/profile/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
    redirect: (context, state) async {
      final authRepo = sl<AuthRepository>();
      final isAuth = await authRepo.isAuthenticated();
      final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/register' || state.matchedLocation == '/splash';

      if (!isAuth && !isLoggingIn) return '/login';
      if (isAuth && isLoggingIn) return '/';
      return null;
    },
  );
}
