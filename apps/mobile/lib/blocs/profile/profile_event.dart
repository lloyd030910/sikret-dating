import 'package:equatable/equatable.dart';
import 'dart:io';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();
  @override
  List<Object?> get props => [];
}

class LoadProfile extends ProfileEvent {}

class UpdateProfile extends ProfileEvent {
  final Map<String, dynamic> data;
  const UpdateProfile(this.data);
  @override
  List<Object?> get props => [data];
}

class UploadPhoto extends ProfileEvent {
  final File image;
  final bool isMain;
  const UploadPhoto(this.image, {this.isMain = false});
  @override
  List<Object?> get props => [image, isMain];
}

class DeletePhoto extends ProfileEvent {
  final String photoId;
  const DeletePhoto(this.photoId);
  @override
  List<Object?> get props => [photoId];
}

class SetMainPhoto extends ProfileEvent {
  final String photoId;
  const SetMainPhoto(this.photoId);
  @override
  List<Object?> get props => [photoId];
}
