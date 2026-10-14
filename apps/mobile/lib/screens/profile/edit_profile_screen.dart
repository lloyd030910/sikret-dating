import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/blocs/profile/profile_bloc.dart';
import 'package:mobile/blocs/profile/profile_event.dart';
import 'package:mobile/blocs/profile/profile_state.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:cached_network_image/cached_network_image.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _bioController = TextEditingController();
  final _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    final state = context.read<ProfileBloc>().state;
    if (state is ProfileLoaded) {
      _bioController.text = state.profile.bio ?? '';
    }
  }

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null && mounted) {
      context.read<ProfileBloc>().add(UploadPhoto(File(image.path)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        actions: [
          TextButton(
            onPressed: () {
              context.read<ProfileBloc>().add(UpdateProfile({'bio': _bioController.text}));
              Navigator.pop(context);
            },
            child: const Text('Done', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          if (state is ProfileLoaded) {
            final profile = state.profile;
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Photos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: 6,
                    itemBuilder: (context, index) {
                      if (index < profile.photos.length) {
                        final photo = profile.photos[index];
                        return Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: CachedNetworkImage(
                                imageUrl: photo.url,
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                              ),
                            ),
                            Positioned(
                              top: 4,
                              right: 4,
                              child: GestureDetector(
                                onTap: () => context.read<ProfileBloc>().add(DeletePhoto(photo.id)),
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                                  child: const Icon(Icons.close, color: Colors.white, size: 16),
                                ),
                              ),
                            ),
                          ],
                        );
                      }
                      return GestureDetector(
                        onTap: _pickImage,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: const Icon(Icons.add, color: Colors.grey),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  const Text('About Me', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _bioController,
                    maxLines: 5,
                    decoration: const InputDecoration(
                      hintText: 'Write something about yourself...',
                    ),
                  ),
                ],
              ),
            );
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
