import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(user: User, photoData: Partial<Photo>): Promise<Photo> {
    const photo = this.photosRepository.create({
      ...photoData,
      user,
    });
    return this.photosRepository.save(photo);
  }

  async findByUser(userId: string): Promise<Photo[]> {
    return this.photosRepository.find({
      where: { user: { id: userId } },
      order: { order: 'ASC' },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.photosRepository.delete({ id, user: { id: userId } });
  }

  async setMain(id: string, userId: string): Promise<void> {
    // Reset all main photos for this user
    await this.photosRepository.update({ user: { id: userId } }, { isMain: false });
    // Set new main photo
    await this.photosRepository.update({ id, user: { id: userId } }, { isMain: true });
  }
}
