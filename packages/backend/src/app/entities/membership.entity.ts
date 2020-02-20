import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { Member } from './member.entity';
import { MembershipPlan } from './membership-plan.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(
    type => Member,
    member => member.memberships,
    { nullable: false }
  )
  member: Member;

  @ManyToOne(
    type => MembershipPlan,
    membershipPlan => membershipPlan.memberships,
    { nullable: false }
  )
  membershipPlan: MembershipPlan;
}
