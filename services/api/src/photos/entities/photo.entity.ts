import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profile_photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  storageKey: string;

  @Column({ default: false })
  isMain: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User;
}
