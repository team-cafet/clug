import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @Column({nullable: true})
  description: string;

}
