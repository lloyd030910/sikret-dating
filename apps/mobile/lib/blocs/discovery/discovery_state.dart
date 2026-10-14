import 'package:equatable/equatable.dart';
import 'package:mobile/models/profile_model.dart';

abstract class DiscoveryState extends Equatable {
  const DiscoveryState();

  @override
  List<Object?> get props => [];
}

class DiscoveryInitial extends DiscoveryState {}

class DiscoveryLoading extends DiscoveryState {}

class DiscoveryLoaded extends DiscoveryState {
  final List<ProfileModel> profiles;
  final ProfileModel? matchedProfile;

  const DiscoveryLoaded({required this.profiles, this.matchedProfile});

  @override
  List<Object?> get props => [profiles, matchedProfile];
}

class DiscoveryError extends DiscoveryState {
  final String message;

  const DiscoveryError(this.message);

  @override
  List<Object> get props => [message];
}
