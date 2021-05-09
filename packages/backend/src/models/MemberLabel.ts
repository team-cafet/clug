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
  ManyToMany,
  BaseEntity
} from 'typeorm';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { IResourceWithOrganisation } from '../libs/interfaces/IResourceWithOrganisation';

@Entity()
export class MemberLabel extends BaseEntity implements IResourceWithOrganisation {
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
