import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/blocs/profile/profile_bloc.dart';
import 'package:mobile/blocs/profile/profile_event.dart';
import 'package:mobile/blocs/profile/profile_state.dart';

class PreferencesScreen extends StatefulWidget {
  const PreferencesScreen({super.key});

  @override
  State<PreferencesScreen> createState() => _PreferencesScreenState();
}

class _PreferencesScreenState extends State<PreferencesScreen> {
  RangeValues _ageRange = const RangeValues(18, 50);
  double _distance = 50;
  String? _genderPref;

  @override
  void initState() {
    super.initState();
    final state = context.read<ProfileBloc>().state;
    if (state is ProfileLoaded) {
      // Assuming these fields are available in ProfileModel (added in Phase 2/4)
      // For now using defaults
    }
  }

  void _save() {
    context.read<ProfileBloc>().add(UpdateProfile({
      'minAgePreference': _ageRange.start.round(),
      'maxAgePreference': _ageRange.end.round(),
      'discoveryRadius': _distance.round(),
      'genderPreference': _genderPref,
    }));
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Preferences'),
        actions: [
          TextButton(onPressed: _save, child: const Text('Save')),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Age Range', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            RangeSlider(
              values: _ageRange,
              min: 18,
              max: 100,
              divisions: 82,
              labels: RangeLabels('${_ageRange.start.round()}', '${_ageRange.end.round()}'),
              onChanged: (values) => setState(() => _ageRange = values),
            ),
            const SizedBox(height: 32),
            const Text('Maximum Distance (km)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Slider(
              value: _distance,
              min: 1,
              max: 200,
              divisions: 200,
              label: '${_distance.round()} km',
              onChanged: (val) => setState(() => _distance = val),
            ),
            const SizedBox(height: 32),
            const Text('Interested in', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildGenderOption('MALE', 'Men'),
            _buildGenderOption('FEMALE', 'Women'),
            _buildGenderOption('BOTH', 'Everyone'),
          ],
        ),
      ),
    );
  }

  Widget _buildGenderOption(String value, String label) {
    return RadioListTile<String>(
      title: Text(label),
      value: value,
      groupValue: _genderPref,
      onChanged: (val) => setState(() => _genderPref = val),
    );
  }
}
