/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { Membership } from './Membership';
import { Club } from './Club';
import { Organisation } from './Organisation';

export enum PlanType {
  weekly,
  monthly,
  quarterly,
  biannual,
  annual,
}

@Entity()
export class MembershipPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.monthly,
    nullable: false
  })
  type: PlanType;

  @Column({ type: 'boolean', nullable: false })
  tacit: boolean;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @OneToMany((type) => Membership, (membership) => membership.plan, {
    nullable: true,
    onDelete: 'NO ACTION',
    eager: false
  })
  memberships: Membership[];

  @ManyToOne((type) => Club, (club) => club.membershipPlans, {
    onDelete: 'NO ACTION',
    nullable: true
  })
  club?: Club;

  @ManyToOne((type) => Organisation, (organisation) => organisation.membershipPlans, {
    onDelete: 'NO ACTION',
    nullable: false,
    eager: true
  })
  organisation: Organisation;

  // ----------------------------- Business Rules
}
