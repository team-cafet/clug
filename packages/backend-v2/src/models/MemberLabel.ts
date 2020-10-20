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
  ManyToMany
} from 'typeorm';
import { User } from './User';
import { Member } from './Member';
import { Organisation } from './Organisation';

@Entity()
export class MemberLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToMany((type) => Member, (member) => member.memberLabels)
  members: Member[];

  @ManyToOne((type) => Organisation, (org) => org.memberLabels)
  organisation: Organisation;
}
