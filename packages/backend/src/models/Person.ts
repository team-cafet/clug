/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { User } from './User';

export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY',
}

@Entity()
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({
    length: 254,
    nullable: true,
  })
  firstname: string;

  @Column({
    length: 254,
    nullable: true,
  })
  lastname: string;

  // ----------------------------- Personal information

  @Column({
    type: 'simple-enum',
    enum: Sexe,
    default: Sexe.MALE,
    nullable: true,
  })
  sexe: Sexe;

  @Column({
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  // ----------------------------- Address information

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  streetNumber: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: number;

  @Column({ nullable: true })
  country: string;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @OneToOne(() => User)
  user: User;

  @OneToOne(() => User, (user) => user.person_responsible, {
    orphanedRowAction: 'delete'
  })
  responsible_of_user: User;
}
