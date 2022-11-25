/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.model';
import { MembershipPlan } from './membership-plan.model';
import { PaymentRequest } from './payment-request.model';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.memberships, {
    nullable: false,
  })
  member: Member;

  @ManyToOne(
    () => MembershipPlan,
    (membershipPlan) => membershipPlan.memberships,
    { nullable: false, eager: true },
  )
  plan: MembershipPlan;

  @OneToOne(
    () => PaymentRequest,
    (paymentRequest) => paymentRequest.membership,
    { cascade: ['insert'] },
  )
  @JoinColumn()
  paymentRequest: PaymentRequest;
}
