import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

import { Organisation } from './organisation.model';
import { User } from './user.model';

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(() => Organisation, (organisation) => organisation.members, {
    onDelete: 'NO ACTION',
    nullable: true,
  })
  organisation: Organisation;

  @ManyToOne(() => User, (user) => user.staffs, {
    onDelete: 'NO ACTION',
    nullable: true,
    cascade: true,
  })
  user: User;
}
