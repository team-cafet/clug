import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from './membership.model';
import { Organisation } from './organisation.model';

export enum PlanType {
  weekly,
  monthly,
  quarterly,
  biannual,
  annual,
}

@Entity()
export class MembershipPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: PlanType,
    default: PlanType.monthly,
    nullable: false,
  })
  type: PlanType;

  @Column({ type: 'boolean', nullable: false })
  tacit: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @OneToMany(() => Membership, (membership) => membership.plan, {
    nullable: true,
    onDelete: 'NO ACTION',
    eager: false,
  })
  memberships: Membership[];

  @ManyToOne(
    () => Organisation,
    (organisation) => organisation.membershipPlans,
    {
      onDelete: 'NO ACTION',
      nullable: false,
      eager: true,
    },
  )
  organisation: Organisation;
}
