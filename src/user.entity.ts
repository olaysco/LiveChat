import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Site } from './site.entity';

export enum UserType {
  VISITOR = 'visitor',
  AGENT = 'agent',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'siteId', referencedColumnName: 'id' })
  siteId: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.VISITOR })
  userType: UserType;

  @CreateDateColumn()
  createdAt: Date;
}
