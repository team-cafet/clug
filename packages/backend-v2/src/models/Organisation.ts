/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { Member } from './Member';
import { Club } from './Club';
import { MemberLabel } from './MemberLabel';
import { MembershipPlan } from './MembershipPlan';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
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

  @OneToMany((type) => Member, (member) => member.organisation, { nullable: true })
  members?: Member[];

  @OneToMany((type) => Club, (club) => club.organisation)
  clubs?: Club[];

  @OneToMany((type) => MemberLabel, (label) => label.organisation)
  memberLabels: MemberLabel[];

  @OneToMany(
    (type) => MembershipPlan,
    (MembershipPlan) => MembershipPlan.organisation,
    { nullable: true }
  )
  membershipPlans?: MembershipPlan[];
}
