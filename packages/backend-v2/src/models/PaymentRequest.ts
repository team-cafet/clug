/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { User } from './User';
import { Member } from './Member';

@Entity()
export class PaymentRequest {
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

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToMany((type) => Member, (member) => member.paymentRequests)
  @JoinTable({ name: 'paymentrequests_members' })
  members: Member[];

  @OneToMany((type) => User, (user) => user.paymentRequests)
  user: User;
}
