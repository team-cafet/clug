import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Membership } from './membership.entity';

export enum TypeOfFacturation {
  WEEKLY,
  MONTHLY,
  HALF_YEARLY,
  QUARTERLY,
  YEARLY
}

@Entity()
export class MembershipPlan {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:30, unique:true})
  designation: string;

  @Column({type:'text', nullable:true})
  description: string;

  @Column({type:'real'})
  amount: number;

  @Column({type:'enum', enum:TypeOfFacturation})
  typeOfFacturation: TypeOfFacturation;

  @OneToMany(
    type=>Membership,
    membership=>membership.member,
    {nullable:true}
  )
  memberships: Membership
}
