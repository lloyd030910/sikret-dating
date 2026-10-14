import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('model_employee_assignments')
@Unique(['employee', 'model'])
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  assignedAt: Date;

  @ManyToOne(() => User)
  assignedBy: User;

  @ManyToOne(() => User)
  employee: User;

  @ManyToOne(() => User)
  model: User;

  @Column({ default: true })
  isActive: boolean;
}
