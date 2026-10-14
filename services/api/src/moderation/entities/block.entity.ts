import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('blocks')
@Unique(['blocker', 'blocked'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  blocker: User;

  @ManyToOne(() => User)
  blocked: User;
}
