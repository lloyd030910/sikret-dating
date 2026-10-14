import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('device_tokens')
@Unique(['token', 'user'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({ nullable: true })
  platform: string; // 'ios', 'android', 'web'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
