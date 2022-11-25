import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { Member } from './member.model';
import { PaymentRequest } from './payment-request.model';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.payments, { nullable: false })
  member: Member;

  @OneToOne(() => PaymentRequest, (paymentRequest) => paymentRequest.membership)
  @JoinColumn()
  paymentRequest: PaymentRequest;
}
