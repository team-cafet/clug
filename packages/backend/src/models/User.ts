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
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from '../config/auth';
import logger from '../libs/functions/logger';
import { Group } from './Group';
import { PaymentRequest } from './PaymentRequest';
import { Staff } from './Staff';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { TypeORMService } from '../libs/services/TypeORMService';

export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY'
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true, select: false })
  password: string;

  // ----------------------------- Personal information

  @Column({ nullable: false })
  email: string;

  @Column({
    length: 254,
    nullable: true
  })
  firstname: string;

  @Column({
    length: 254,
    nullable: true
  })
  lastname: string;

  @Column({
    type: 'simple-enum',
    enum: Sexe,
    default: Sexe.MALE,
    nullable: true
  })
  sexe: Sexe;

  @Column({
    length: 50,
    nullable: true
  })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({
    nullable: true
  })
  pictureURL: string;

  // ----------------------------- Address information

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

  // ----------------------------- Special information

  @Column({ type: 'simple-json', nullable: true })
  settings: any;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  // ----------------------------- Relations

  @ManyToOne((type) => Group, (group) => group.users, { eager: true })
  group: Group;

  @OneToMany((type) => PaymentRequest, (payReq) => payReq.user)
  paymentRequests: PaymentRequest[];

  @OneToMany((type) => Staff, (staff) => staff.user, {
    onDelete: 'NO ACTION',
    nullable: true
  })
  staffs: Staff[];

  @OneToMany((type) => Member, (member) => member.user, {
    onDelete: 'NO ACTION',
    nullable: true
  })
  members: Member[];

  // ----------------------------- Getter and Setter

  /**
   *
   * @param password
   */
  async setPassword(password: string): Promise<void> {
    try {
      this.password = await hash(password, BCRYPT_SALT_ROUND);
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * Get the organisation from a user
   * @returns the organisation or null if the user is not in an organisation
   */
  async getUserOrganisation(): Promise<Organisation | null> {
    const userRepo = TypeORMService.getInstance().getRepository(User);
    const currentUser = await userRepo.findOne({
      where: {id: this.id},
      relations: ['staffs']
    });
    const staffs = currentUser.staffs;

    if (!staffs || staffs.length < 1) {
      return null;
    }

    const loadedStaff = await TypeORMService.getInstance().getRepository(Staff).findOneOrFail({
      where: {
        id: staffs[0].id
      },
      relations: ['organisation']
    });

    const organisation = loadedStaff.organisation;

    if (!organisation) {
      return null;
    }

    return organisation;
  }

  // ----------------------------- Hooks

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassowrd(): Promise<void> {
    await this.setPassword(this.password);
  }
}
