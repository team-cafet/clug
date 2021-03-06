/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne
} from 'typeorm';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { MembershipPlan } from './MembershipPlan';
import { IResourceWithOrganisation } from '../libs/interfaces/IResourceWithOrganisation';

@Entity()
export class Club implements IResourceWithOrganisation{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @OneToMany((type) => Member, (member) => member.club)
  members: Member[];

  @ManyToOne((type) => Organisation, (organisation) => organisation.clubs)
  organisation: Organisation;

  @OneToMany((type) => MembershipPlan, (MembershipPlan) => MembershipPlan.club)
  membershipPlans: MembershipPlan[];
}
