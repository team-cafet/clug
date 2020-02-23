import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
