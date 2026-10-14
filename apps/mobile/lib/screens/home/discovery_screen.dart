import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:mobile/blocs/discovery/discovery_bloc.dart';
import 'package:mobile/blocs/discovery/discovery_event.dart';
import 'package:mobile/blocs/discovery/discovery_state.dart';
import 'package:mobile/widgets/discovery/profile_card.dart';
import 'package:mobile/widgets/discovery/match_dialog.dart';

class DiscoveryScreen extends StatelessWidget {
  const DiscoveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DiscoveryBloc, DiscoveryState>(
      listener: (context, state) {
        if (state is DiscoveryLoaded && state.matchedProfile != null) {
          showDialog(
            context: context,
            builder: (context) => MatchDialog(matchedProfile: state.matchedProfile!),
          );
        }
      },
      builder: (context, state) {
        if (state is DiscoveryLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is DiscoveryError) {
          return Center(child: Text('Error: ${state.message}'));
        }

        if (state is DiscoveryLoaded) {
          if (state.profiles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('No more profiles to discover', style: TextStyle(fontSize: 18)),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () => context.read<DiscoveryBloc>().add(LoadDiscovery()),
                    child: const Text('Refresh'),
                  ),
                ],
              ),
            );
          }

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
            child: CardSwiper(
              cardsCount: state.profiles.length,
              onSwipe: (previousIndex, currentIndex, direction) {
                final profile = state.profiles[previousIndex];
                context.read<DiscoveryBloc>().add(SwipeProfile(
                  userId: profile.id,
                  isLike: direction == CardSwiperDirection.right,
                ));
                return true;
              },
              cardBuilder: (context, index, horizontalThresholdPercentage, verticalThresholdPercentage) {
                return ProfileCard(profile: state.profiles[index]);
              },
            ),
          );
        }

        return const SizedBox();
      },
    );
  }
}
