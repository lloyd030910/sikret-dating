import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
