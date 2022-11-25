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
} from 'typeorm';
import { Membership } from './membership.model';
import { Payment } from './payment.model';
import { Organisation } from './organisation.model';
import { PaymentRequest } from './payment-request.model';
import { User } from './user.model';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'real', nullable: false, default: 0 })
  balance: number;

  @Column({ type: 'simple-json', nullable: true })
  customInformations: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(() => Organisation, (organisation) => organisation.members, {
    onDelete: 'NO ACTION',
    nullable: false,
    eager: true,
  })
  organisation: Organisation;

  @OneToMany(() => Membership, (membership) => membership.member, {
    nullable: false,
    onDelete: 'NO ACTION',
    eager: true,
    cascade: true,
  })
  memberships: Membership[];

  @OneToMany(() => Payment, (payment) => payment.member, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  payments: Payment[];

  @ManyToMany(() => PaymentRequest, (payReq) => payReq.members, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  paymentRequests: PaymentRequest[];

  @ManyToOne(() => User, (user) => user.members, {
    onDelete: 'NO ACTION',
    nullable: false,
    cascade: true,
    eager: true,
  })
  user: User;
}
