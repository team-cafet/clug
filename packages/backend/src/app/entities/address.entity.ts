/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Address {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  street: string;

  @Column({ nullable: false })
  streetNumber: number;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  postalCode: number;

  @Column({ nullable: false })
  country: string;

  @OneToOne(type => Member)
  member: Member;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;
}
