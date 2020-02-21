import { UserWithPermissions, Group, Permission } from "@foal/typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User extends UserWithPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-array")
  groups: Group[];

  @Column("simple-array")
  userPermissions: Permission[];
}

export { Group, Permission } from "@foal/typeorm";
