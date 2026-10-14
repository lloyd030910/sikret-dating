import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/repositories/discovery_repository.dart';
import 'discovery_event.dart';
import 'discovery_state.dart';

class DiscoveryBloc extends Bloc<DiscoveryEvent, DiscoveryState> {
  final DiscoveryRepository discoveryRepository;

  DiscoveryBloc({required this.discoveryRepository}) : super(DiscoveryInitial()) {
    on<LoadDiscovery>(_onLoadDiscovery);
    on<SwipeProfile>(_onSwipeProfile);
  }

  Future<void> _onLoadDiscovery(LoadDiscovery event, Emitter<DiscoveryState> emit) async {
    emit(DiscoveryLoading());
    try {
      final profiles = await discoveryRepository.getDiscovery();
      emit(DiscoveryLoaded(profiles: profiles));
    } catch (e) {
      emit(DiscoveryError(e.toString()));
    }
  }

  Future<void> _onSwipeProfile(SwipeProfile event, Emitter<DiscoveryState> emit) async {
    if (state is DiscoveryLoaded) {
      final currentState = state as DiscoveryLoaded;
      final type = event.isLike ? 'LIKE' : 'PASS';

      try {
        final result = await discoveryRepository.submitLike(event.userId, type);

        if (result['match'] != null) {
          // Find the profile we just swiped to show in the match dialog
          final matchedProfile = currentState.profiles.firstWhere((p) => p.id == event.userId);
          emit(DiscoveryLoaded(
            profiles: currentState.profiles.where((p) => p.id != event.userId).toList(),
            matchedProfile: matchedProfile,
          ));
        } else {
          emit(DiscoveryLoaded(
            profiles: currentState.profiles.where((p) => p.id != event.userId).toList(),
          ));
        }
      } catch (e) {
        // Handle error, maybe keep profile in stack
      }
    }
  }
}
