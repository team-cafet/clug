import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';
import { Member } from './member.model';
import { MembershipPlan } from './membership-plan.model';
import { Staff } from './staff.model';

@Entity()
export class Organisation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @OneToMany(() => Member, (member) => member.organisation, { nullable: true })
  members?: Member[];

  @OneToMany(
    () => MembershipPlan,
    (MembershipPlan) => MembershipPlan.organisation,
    { nullable: true },
  )
  membershipPlans?: MembershipPlan[];

  @OneToMany(() => Staff, (staff) => staff.organisation, { nullable: true })
  staffs?: Staff[];
}
