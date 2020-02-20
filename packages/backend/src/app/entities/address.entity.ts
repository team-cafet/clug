// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  street: string

  @Column({nullable: false})
  streetNumber: number

  @Column({nullable: false})
  city: string

  @Column({nullable: false})
  postalCode: number

  @Column({nullable: false})
  country: string

}
