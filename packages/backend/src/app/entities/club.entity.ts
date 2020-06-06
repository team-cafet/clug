/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  designation: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(type => Member, member => member.club)
  members: Member[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}
