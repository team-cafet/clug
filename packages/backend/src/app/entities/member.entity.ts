import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { Club } from './club.entity';

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
  name: string;

  @Column({
    length: 254
  })
  surname: string;

  @Column({
    type: 'enum',
    enum: Sexe,
    default: Sexe.MALE
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

  // TODO
  // @Column({
  //   length: "254",
  //   nullable: true
  // })
  // picture: string;

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

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(
    type => Club,
    club => club.members,
    { onDelete: 'CASCADE', nullable: true }
  )
  club: Club;
}
