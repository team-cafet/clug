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
import { Membership } from './Membership';
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

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.MONTHLY,
    nullable: false
  })
  name: PlanType;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Membership, (membership) => membership.plan, {
    nullable: true,
    onDelete: 'NO ACTION'
  })
  memberships: Membership;
}
