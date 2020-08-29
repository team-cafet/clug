/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Club } from './Club';
import { Membership } from './Membership';
import { Payment } from './Payment';
import { Organisation } from './Organisation';
import { PaymentRequest } from './PaymentRequest';
import { User } from './User';
import { MemberLabel } from './MemberLabel';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ----------------------------- Internal purpose informations

  @Column({ type: 'text', nullable: true })
  note: string;

  // ----------------------------- Financial informations

  @Column({ type: 'real', nullable: false, default:0 })
  balance: number;

  // ----------------------------- Special information

  @Column({ type: 'json', nullable: true })
  customInformations: any;
  
  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Organisation, (organisation) => organisation.members, {
    onDelete: 'NO ACTION',
    nullable: false,
    eager: true
  })
  organisation: Organisation;

  @ManyToOne((type) => Club, (club) => club.members, {
    onDelete: 'NO ACTION',
    nullable: true
  })
  club: Promise<Club>;

  @OneToMany((type) => Membership, (membership) => membership.member, {
    nullable: false,
    onDelete: 'NO ACTION',
    eager: true
  })
  memberships: Membership[];

  @OneToMany((type) => Payment, (payment) => payment.member, {
    nullable: true,
    onDelete: 'NO ACTION'
  })
  payments: Payment[];

  @ManyToMany((type) => PaymentRequest, (payReq) => payReq.members, {
    nullable: true,
    onDelete: 'NO ACTION'
  })
  paymentRequests: PaymentRequest[];

  @ManyToMany((type) => MemberLabel, (label) => label.members, {
    nullable: true,
    onDelete: 'NO ACTION'
  })
  @JoinTable({ name: 'members_labels' })
  memberLabels: MemberLabel[];

  @ManyToOne((type) => User, (user) => user.members, {
    onDelete: 'NO ACTION',
    nullable: false,
    cascade: true,
    eager: true
  })
  user: User;
  
}
