/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { Member } from './Member';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', nullable: false })
  amount: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  hasBeenCanceled: boolean;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Member, (member) => member.payments, { nullable: false })
  member: Member;

  @OneToOne((type) => PaymentRequest, (paymentRequest) => paymentRequest.payment)
  @JoinColumn()
  paymentRequest: PaymentRequest;
}
