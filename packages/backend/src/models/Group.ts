import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.group)
  users: User[];
}
