import 'package:mobile/core/network/api_client.dart';

class AuthRepository {
  final ApiClient apiClient;

  AuthRepository({required this.apiClient});

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await apiClient.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> register(String email, String password, String displayName) async {
    final response = await apiClient.post('/auth/register', data: {
      'email': email,
      'password': password,
      'displayName': displayName,
    });
    return response.data;
  }

  Future<void> saveToken(String token) async {
    await apiClient.storage.write(key: 'auth_token', value: token);
  }

  Future<void> logout() async {
    await apiClient.storage.delete(key: 'auth_token');
  }

  Future<bool> isAuthenticated() async {
    final token = await apiClient.storage.read(key: 'auth_token');
    return token != null;
  }
}
