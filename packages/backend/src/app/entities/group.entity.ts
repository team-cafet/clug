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

  @Column()
  name: string;

  @Column()
  codeName: string;

  @ManyToMany(type => Permission)
  @JoinTable()
  permissions: Permission[];
}
