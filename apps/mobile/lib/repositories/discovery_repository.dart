import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/models/profile_model.dart';

class DiscoveryRepository {
  final ApiClient apiClient;

  DiscoveryRepository({required this.apiClient});

  Future<List<ProfileModel>> getDiscovery() async {
    final response = await apiClient.get('/discovery');
    final List<dynamic> data = response.data;
    return data.map((json) => ProfileModel.fromJson(json)).toList();
  }

  Future<Map<String, dynamic>> submitLike(String userId, String type) async {
    final response = await apiClient.post('/likes', data: {
      'toUserId': userId,
      'type': type,
    });
    return response.data;
  }
}
