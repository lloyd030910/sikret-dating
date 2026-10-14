import 'package:equatable/equatable.dart';

class PhotoModel extends Equatable {
  final String id;
  final String url;
  final bool isMain;

  const PhotoModel({
    required this.id,
    required this.url,
    required this.isMain,
  });

  factory PhotoModel.fromJson(Map<String, dynamic> json) {
    return PhotoModel(
      id: json['id'],
      url: json['url'],
      isMain: json['isMain'] ?? false,
    );
  }

  @override
  List<Object?> get props => [id, url, isMain];
}

class ProfileModel extends Equatable {
  final String id;
  final String displayName;
  final String? bio;
  final String? gender;
  final List<String> interests;
  final int age;
  final double? distance;
  final List<PhotoModel> photos;

  const ProfileModel({
    required this.id,
    required this.displayName,
    this.bio,
    this.gender,
    required this.interests,
    required this.age,
    this.distance,
    required this.photos,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] ?? {};

    // Calculate age from DOB if available
    int calculatedAge = 18;
    if (profile['dateOfBirth'] != null) {
      final dob = DateTime.parse(profile['dateOfBirth']);
      calculatedAge = DateTime.now().year - dob.year;
    }

    return ProfileModel(
      id: json['id'],
      displayName: profile['displayName'] ?? 'User',
      bio: profile['bio'],
      gender: profile['gender'],
      interests: (profile['interests'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      age: calculatedAge,
      distance: null, // To be calculated or provided by API
      photos: (json['photos'] as List<dynamic>?)
              ?.map((e) => PhotoModel.fromJson(e))
              .toList() ??
          [],
    );
  }

  String get mainPhotoUrl => photos.firstWhere((p) => p.isMain, orElse: () => photos.isNotEmpty ? photos.first : const PhotoModel(id: '', url: 'https://via.placeholder.com/400', isMain: true)).url;

  @override
  List<Object?> get props => [id, displayName, bio, age, photos];
}
