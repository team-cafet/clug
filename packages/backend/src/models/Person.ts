/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { MembershipPlan } from './MembershipPlan';
import { IResourceWithOrganisation } from '../libs/interfaces/IResourceWithOrganisation';
import { User } from './User';

@Entity()
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({
    length: 254,
    nullable: true
  })
  firstname: string;

  @Column({
    length: 254,
    nullable: true
  })
  lastname: string;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations 

  /* @OneToMany((type) => User, (user) => user.person)
  users: User[]; */
}
