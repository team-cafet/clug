/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity
} from 'typeorm';
import { Member } from './Member';
import { MembershipPlan } from './MembershipPlan';
import { Staff } from './Staff';

@Entity()
export class Organisation extends BaseEntity {
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

  @OneToMany(
    (type) => MembershipPlan,
    (MembershipPlan) => MembershipPlan.organisation,
    { nullable: true }
  )
  membershipPlans?: MembershipPlan[];
  
  @OneToMany(() => Staff, (staff) => staff.organisation, {nullable: true})
  staffs?: Staff[];
}
