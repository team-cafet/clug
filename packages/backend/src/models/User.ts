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
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  getRepository,
  JoinColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from '../config/auth';
import logger from '../util/logger';
import { Group } from './Group';
import { PaymentRequest } from './PaymentRequest';
import { Staff } from './Staff';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { Person } from './Person';

export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY',
}

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true, select: false })
  password: string;

  // ----------------------------- Personal information

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

  // ----------------------------- Relations

  @ManyToOne((type) => Group, (group) => group.users, { eager: false })
  group: Group;

  @OneToMany((type) => PaymentRequest, (payReq) => payReq.user)
  paymentRequests: PaymentRequest[];

  @OneToMany((type) => Staff, (staff) => staff.user, {
    onDelete: 'NO ACTION',
    nullable: true,
  })
  staffs: Staff[];

  @OneToMany((type) => Member, (member) => member.user, {
    onDelete: 'NO ACTION',
    nullable: true,
  })
  members: Member[];

  @OneToOne(() => Person,{
    cascade: true,
    eager: false
  })
  @JoinColumn()
  person: Person

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
    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(this.id, {
      relations: ['staffs'],
    });
    const staffs = currentUser.staffs;

    if (!staffs || staffs.length < 1) {
      return null;
    }

    const loadedStaff = await getRepository(Staff).findOneOrFail(staffs[0].id, {
      relations: ['organisation'],
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
