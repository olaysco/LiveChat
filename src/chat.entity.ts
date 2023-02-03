import { User } from './user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  from: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  to: string;

  @Column({ unique: true })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
