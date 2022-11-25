import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { User } from './user.model';
import { Member } from './member.model';
import { Membership } from './membership.model';
import { Payment } from './payment.model';

@Entity()
export class PaymentRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', nullable: false })
  amount: number;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  hasBeenCanceled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToMany(() => Member, (member) => member.paymentRequests)
  @JoinTable({ name: 'paymentrequests_members' })
  members: Member[];

  @OneToMany(() => User, (user) => user.paymentRequests)
  user: User;

  @OneToOne(() => Membership, (membership) => membership.paymentRequest)
  membership: Membership;

  @OneToOne(() => Payment, (payment) => payment.paymentRequest)
  payment: Payment;
}
