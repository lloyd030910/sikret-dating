import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  locationName: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'int', default: 18 })
  minAgePreference: number;

  @Column({ type: 'int', default: 100 })
  maxAgePreference: number;

  @Column({ nullable: true })
  genderPreference: string;

  @Column({ type: 'int', default: 50 })
  discoveryRadius: number; // in kilometers

  @Column({ type: 'simple-array', nullable: true })
  interests: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
