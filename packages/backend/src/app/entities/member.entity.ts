import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Club } from './club.entity';
import { Membership } from './membership.entity';
import { Address } from "./address.entity";

export enum Sexe {
  "MALE",
  "FEMALE",
  "NON-BINARY"
}

export enum FinancialStatus {
  "OK",
  "WARNING",
  "ALERT"
}

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 254
  })
  name: string;

  @Column({
    length: 254
  })
  surname: string;

  @Column({
    type: "enum",
    enum: Sexe,
    default: Sexe.MALE,
    nullable: true
  })
  sexe: Sexe;

  @Column({
    length: 254,
    unique: true
  })
  email: string;

  @Column({
    length: 50,
    nullable: true
  })
  phone: string;

  @Column({ type: "date", nullable: true })
  birthdate: Date;

  @Column({
    type: "enum",
    enum: FinancialStatus,
    default: FinancialStatus.OK,
    nullable: true
  })
  financialStatus: FinancialStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "date", nullable: true })
  deletedAt: Date;

  @ManyToOne(
    type => Club,
    club => club.members,
    { onDelete: 'NO ACTION', nullable: true }
  )
  club: Club;

  @OneToMany(
    type => Membership,
    membership => membership.member,
    { nullable: true, onDelete: 'NO ACTION' }
  )
  memberships: Membership;

  @OneToOne(type => Address)
  @JoinColumn()
  address: Address;
}
