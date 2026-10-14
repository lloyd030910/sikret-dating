import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LikeType } from '../enums/like-type.enum';

@Entity('likes')
@Unique(['fromUser', 'toUser'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LikeType,
  })
  type: LikeType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  fromUser: User;

  @ManyToOne(() => User)
  toUser: User;
}
