/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Organisation } from './Organisation';
import { User } from './User';

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Organisation, (organisation) => organisation.members, {
    onDelete: 'NO ACTION',
    nullable: true,
    eager: true
  })
  organisation: Organisation;

  @ManyToOne((type) => User, (user) => user.staffs, {
    onDelete: 'NO ACTION',
    nullable: true,
    cascade: true,
    eager: true
  })
  user: User;
}
