import { UserWithPermissions, Group, Permission } from "@foal/typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User extends UserWithPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groups: Group[];

  @Column()
  userPermissions: Permission[];
}

export { Group, Permission } from "@foal/typeorm";
