import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:mobile/repositories/discovery_repository.dart';
import 'package:mobile/repositories/chat_repository.dart';
import 'package:mobile/repositories/profile_repository.dart';
import 'package:mobile/blocs/discovery/discovery_bloc.dart';
import 'package:mobile/blocs/chat/chat_bloc.dart';
import 'package:mobile/blocs/profile/profile_bloc.dart';
import 'package:mobile/core/services/socket_service.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Blocs
  sl.registerFactory(() => DiscoveryBloc(discoveryRepository: sl()));
  sl.registerFactory(() => ChatBloc(chatRepository: sl(), socketService: sl()));
  sl.registerFactory(() => ProfileBloc(profileRepository: sl()));

  // Repositories
  sl.registerLazySingleton(() => AuthRepository(apiClient: sl()));
  sl.registerLazySingleton(() => DiscoveryRepository(apiClient: sl()));
  sl.registerLazySingleton(() => ChatRepository(apiClient: sl()));
  sl.registerLazySingleton(() => ProfileRepository(apiClient: sl()));

  // Services
  sl.registerLazySingleton(() => SocketService(storage: sl()));

  // Core
  sl.registerLazySingleton(() => ApiClient(dio: sl(), storage: sl()));

  // External
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => const FlutterSecureStorage());
}
