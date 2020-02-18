import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

}
