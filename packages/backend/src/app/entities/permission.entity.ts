// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true, length: 100})
  codeName: string

}
