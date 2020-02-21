import { UserWithPermissions, Group, Permission } from "@foal/typeorm";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class User extends UserWithPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Group)
  @JoinTable()
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  userPermissions: Permission[];
}

export { Group, Permission } from "@foal/typeorm";
