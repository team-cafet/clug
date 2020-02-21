// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Permission } from "@foal/typeorm";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 80})
  name: string;

  @Column({unique: true, length: 100})
  codeName: string;

  @ManyToMany(type => Permission)
  @JoinTable()
  permissions: Permission[];
}
