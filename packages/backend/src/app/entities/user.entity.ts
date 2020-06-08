import { hashPassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserWithPermissions } from '@foal/typeorm';

@Entity()
export class User extends UserWithPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }
}

export { Group, Permission } from '@foal/typeorm';
