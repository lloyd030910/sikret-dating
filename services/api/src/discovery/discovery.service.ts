import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, Brackets } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LikesService } from '../likes/likes.service';
import { ModerationService } from '../moderation/moderation.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private likesService: LikesService,
    private moderationService: ModerationService,
  ) {}

  async getDiscoverableProfiles(user: User): Promise<User[]> {
    const swipedIds = await this.likesService.getSwipedUserIds(user.id);
    const blockedIds = await this.moderationService.getBlockedUserIds(user.id);
    const excludeIds = [...new Set([...swipedIds, ...blockedIds, user.id])];

    const { profile } = user;
    const genderPref = profile.genderPreference;
    const minAge = profile.minAgePreference;
    const maxAge = profile.maxAgePreference;

    const query = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.photos', 'photos')
      .where('user.id NOT IN (:...excludeIds)', { excludeIds })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.MEMBER });

    if (genderPref) {
      query.andWhere('profile.gender = :genderPref', { genderPref });
    }

    // Age filtering logic (DOB to Age)
    // For simplicity, we filter by DOB range
    const now = new Date();
    const minDOB = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
    const maxDOB = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());

    query.andWhere('profile.dateOfBirth BETWEEN :minDOB AND :maxDOB', { minDOB, maxDOB });

    const potentialMatches = await query.getMany();

    // Distance filtering (Manual for now, can be optimized with PostGIS)
    if (profile.latitude && profile.longitude) {
      return potentialMatches.filter((u) => {
        if (!u.profile.latitude || !u.profile.longitude) return false;
        const dist = this.calculateDistance(
          profile.latitude,
          profile.longitude,
          u.profile.latitude,
          u.profile.longitude,
        );
        return dist <= profile.discoveryRadius;
      });
    }

    return potentialMatches;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
