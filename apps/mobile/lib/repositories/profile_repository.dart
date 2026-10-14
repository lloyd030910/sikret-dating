import 'package:dio/dio.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/models/profile_model.dart';
import 'package:http_parser/http_parser.dart';
import 'dart:io';

class ProfileRepository {
  final ApiClient apiClient;

  ProfileRepository({required this.apiClient});

  Future<ProfileModel> getMe() async {
    final response = await apiClient.get('/users/me');
    return ProfileModel.fromJson(response.data);
  }

  Future<ProfileModel> updateProfile(Map<String, dynamic> data) async {
    final response = await apiClient.patch('/users/me', data: data);
    return ProfileModel.fromJson(response.data);
  }

  Future<void> uploadPhoto(File image, {bool isMain = false}) async {
    String fileName = image.path.split('/').last;
    FormData formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(
        image.path,
        filename: fileName,
        contentType: MediaType("image", "jpeg"),
      ),
      "isMain": isMain.toString(),
    });

    await apiClient.post('/photos/upload', data: formData);
  }

  Future<void> deletePhoto(String photoId) async {
    await apiClient.delete('/photos/$photoId');
  }

  Future<void> setMainPhoto(String photoId) async {
    await apiClient.post('/photos/$photoId/main');
  }

  Future<void> deleteAccount() async {
    await apiClient.delete('/users/me');
  }
}
