import 'package:equatable/equatable.dart';

abstract class DiscoveryEvent extends Equatable {
  const DiscoveryEvent();

  @override
  List<Object> get props => [];
}

class LoadDiscovery extends DiscoveryEvent {}

class SwipeProfile extends DiscoveryEvent {
  final String userId;
  final bool isLike;

  const SwipeProfile({required this.userId, required this.isLike});

  @override
  List<Object> get props => [userId, isLike];
}
