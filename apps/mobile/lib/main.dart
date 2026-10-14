import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/routing/app_router.dart';
import 'package:mobile/core/theme/app_theme.dart';
import 'package:mobile/injection_container.dart' as di;
import 'package:mobile/blocs/discovery/discovery_bloc.dart';
import 'package:mobile/blocs/discovery/discovery_event.dart';
import 'package:mobile/blocs/chat/chat_bloc.dart';
import 'package:mobile/blocs/chat/chat_event.dart';
import 'package:mobile/blocs/profile/profile_bloc.dart';
import 'package:mobile/blocs/profile/profile_event.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => di.sl<DiscoveryBloc>()..add(LoadDiscovery()),
        ),
        BlocProvider(
          create: (context) => di.sl<ChatBloc>()..add(LoadConversations()),
        ),
        BlocProvider(
          create: (context) => di.sl<ProfileBloc>()..add(LoadProfile()),
        ),
      ],
      child: MaterialApp.router(
        title: 'Dating Platform',
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter.router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
