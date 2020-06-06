/* eslint-disable @typescript-eslint/no-unused-vars */
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
  OneToMany,
  DeleteDateColumn
} from 'typeorm';
import { Club } from './club.entity';
import { Membership } from './membership.entity';
import { Address } from './address.entity';
import { Level } from './level.entity';

export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY'
}

export enum FinancialStatus {
  'OK',
  'WARNING',
  'ALERT'
}

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 254
  })
  firstname: string;

  @Column({
    length: 254
  })
  lastname: string;

  @Column({
    type: 'enum',
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

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({
    type: 'enum',
    enum: FinancialStatus,
    default: FinancialStatus.OK,
    nullable: true
  })
  financialStatus: FinancialStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(
    type => Club,
    club => club.members,
    { onDelete: 'NO ACTION', nullable: true }
  )
  club: Club;

  @ManyToOne(
    type => Level,
    level => level.members,
    { onDelete: 'NO ACTION', nullable: true }
  )
  level: Level;

  @OneToMany(
    type => Membership,
    membership => membership.member,
    { nullable: true, onDelete: 'NO ACTION', cascade: [ 'insert' ] }
  )
  memberships: Membership;

  @OneToOne(type => Address, { cascade: true })
  @JoinColumn()
  address: Address;
}
