import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @Column({nullable: true})
  description: string;

  @OneToMany(type => Member, member => member.club, {cascade: true})
  members: Member[];

}
