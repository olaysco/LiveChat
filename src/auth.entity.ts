import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userId: number;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
