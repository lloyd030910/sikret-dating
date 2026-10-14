import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';
import { Match } from '../../likes/entities/match.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable({ name: 'conversation_participants' })
  participants: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToOne(() => Match, { nullable: true })
  @JoinColumn()
  match: Match;
}
