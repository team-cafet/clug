/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { Member } from './Member';
export enum PlanType {
  'WEEKLY',
  'MONTHLY',
  'QUARTERLY',
  'BIANNUALY',
  'YEARLY'
}

@Entity()
export class MembershipPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', nullable: false })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  description: string;

// ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations
  
  @ManyToOne(
    type => Member,
    member => member.memberships,
    { nullable: false }
  )
  member: Member;

  @ManyToOne(
    type => MembershipPlan,
    member => member.memberships,
    { nullable: false }
  )
  member: Member;

}
