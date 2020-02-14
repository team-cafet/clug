import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Member } from './member.entity';

export enum TypeOfFacturation {  
    WEEKLY,
    MONTHLY,
    HALFYEARLY,
    QUARTERLY,
    YEARLY    
}

@Entity()
export class SubscriptionPlan {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'number'})
  amount: number;

  @Column({type:'string',nullable:true})
  description: string;

  @Column({type:'date'})
  dateOfInvoicing: Date;

  @Column({type:'enum', enum:TypeOfFacturation, default:TypeOfFacturation.MONTHLY})
  typeOfFacturation: TypeOfFacturation;
}