import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
  USER = 'USER',
  MESSAGE = 'MESSAGE',
  PHOTO = 'PHOTO',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  targetType: ReportType;

  @Column()
  targetId: string; // The ID of the reported user, message, or photo

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  moderationNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  reporter: User;

  @ManyToOne(() => User, { nullable: true })
  targetUser: User; // The user who is being reported (or the author of the reported content)

  @ManyToOne(() => User, { nullable: true })
  moderator: User;
}
