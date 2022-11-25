import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Group } from './group.model';
import { PaymentRequest } from './payment-request.model';
import { Staff } from './staff.model';
import { Member } from './member.model';

export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: false })
  email: string;

  @Column({
    length: 254,
    nullable: true,
  })
  firstname: string;

  @Column({
    length: 254,
    nullable: true,
  })
  lastname: string;

  @Column({
    type: 'simple-enum',
    enum: Sexe,
    default: Sexe.MALE,
    nullable: true,
  })
  sexe: Sexe;

  @Column({
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({
    nullable: true,
  })
  pictureURL: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  streetNumber: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: number;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'simple-json', nullable: true })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @ManyToOne(() => Group, (group) => group.users, { eager: true })
  group: Group;

  @OneToMany(() => PaymentRequest, (payReq) => payReq.user)
  paymentRequests: PaymentRequest[];

  @OneToMany(() => Staff, (staff) => staff.user, {
    onDelete: 'NO ACTION',
    nullable: true,
  })
  staffs: Staff[];

  @OneToMany(() => Member, (member) => member.user, {
    onDelete: 'NO ACTION',
    nullable: true,
  })
  members: Member[];

  async setPassword(password: string): Promise<void> {
    // try {
      // this.password = await hash(password, BCRYPT_SALT_ROUND);
    // } catch (err) {
    // }
  }

  // async getUserOrganisation(): Promise<Organisation | null> {
  //   const userRepo = TypeORMService.getInstance().getRepository(User);
  //   const currentUser = await userRepo.findOne({
  //     where: {id: this.id},
  //     relations: ['staffs']
  //   });
  //   const staffs = currentUser.staffs;

  //   if (!staffs || staffs.length < 1) {
  //     return null;
  //   }

  //   const loadedStaff = await TypeORMService.getInstance().getRepository(Staff).findOneOrFail({
  //     where: {
  //       id: staffs[0].id
  //     },
  //     relations: ['organisation']
  //   });

  //   const organisation = loadedStaff.organisation;

  //   if (!organisation) {
  //     return null;
  //   }

  //   return organisation;
  // }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassowrd(): Promise<void> {
    await this.setPassword(this.password);
  }
}
