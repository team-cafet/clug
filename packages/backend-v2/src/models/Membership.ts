/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  getRepository,
  OneToOne,
  JoinColumn
} from 'typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { Member } from './Member';
import { MembershipPlan } from './MembershipPlan';
import { APIError } from '../libs/classes/APIError';
import { PaymentRequest } from './PaymentRequest';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Member, (member) => member.memberships, {
    nullable: false
  })
  member: Member;

  @ManyToOne(
    (type) => MembershipPlan,
    (membershipPlan) => membershipPlan.memberships,
    { nullable: false }
  )
  plan: MembershipPlan;

  @OneToOne(
    (type) => PaymentRequest,
    (paymentRequest) => paymentRequest.membership
  )
  @JoinColumn()
  paymentRequest: PaymentRequest;

  // ----------------------------- Business Rules

  private static async endDateAfterStartDate(
    data: Membership
  ): Promise<boolean> {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate.getTime() >= endDate.getTime()) {
      return false;
    }

    return true;
  }

  private static async onlyOneMembershipByMember(
    data: Membership
  ): Promise<boolean> {
    const memberRepo = getRepository(Member);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const member = await memberRepo.findOne(data.member.id);

    if (member.memberships && member.memberships.length > 0) {
      member.memberships.forEach((membership) => {
        const memberStart = new Date(membership.startDate);
        const memberEnd = new Date(membership.endDate);
        if (
          (memberEnd.getTime() >= endDate.getTime() &&
            memberEnd.getTime() <= startDate.getTime()) ||
          (memberStart.getTime() >= startDate.getTime() &&
            memberStart.getTime() <= endDate.getTime())
        ) {
          return false;
        }
      });
    }

    return true;
  }

  public static async validate(data: Membership): Promise<APIError | void> {
    if (await Membership.endDateAfterStartDate(data))
      return new APIError(400, 'Start date mustn\'t be after end date');

    if (await Membership.onlyOneMembershipByMember(data))
      return new APIError(400, 'Only one membership authorized by member');

    return;
  }
}
