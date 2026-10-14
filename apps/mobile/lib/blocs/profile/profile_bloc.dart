import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/repositories/profile_repository.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final ProfileRepository profileRepository;

  ProfileBloc({required this.profileRepository}) : super(ProfileInitial()) {
    on<LoadProfile>(_onLoadProfile);
    on<UpdateProfile>(_onUpdateProfile);
    on<UploadPhoto>(_onUploadPhoto);
    on<DeletePhoto>(_onDeletePhoto);
    on<SetMainPhoto>(_onSetMainPhoto);
  }

  Future<void> _onLoadProfile(LoadProfile event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    try {
      final profile = await profileRepository.getMe();
      emit(ProfileLoaded(profile));
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> _onUpdateProfile(UpdateProfile event, Emitter<ProfileState> emit) async {
    try {
      final profile = await profileRepository.updateProfile(event.data);
      emit(ProfileLoaded(profile));
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> _onUploadPhoto(UploadPhoto event, Emitter<ProfileState> emit) async {
    try {
      await profileRepository.uploadPhoto(event.image, isMain: event.isMain);
      add(LoadProfile());
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> _onDeletePhoto(DeletePhoto event, Emitter<ProfileState> emit) async {
    try {
      await profileRepository.deletePhoto(event.photoId);
      add(LoadProfile());
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> _onSetMainPhoto(SetMainPhoto event, Emitter<ProfileState> emit) async {
    try {
      await profileRepository.setMainPhoto(event.photoId);
      add(LoadProfile());
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }
}
