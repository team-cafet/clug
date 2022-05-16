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
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from '../config/auth';
import logger from '../libs/functions/logger';
import { Group } from './Group';
import { PaymentRequest } from './PaymentRequest';
import { Staff } from './Staff';
import { Member } from './Member';
import { Organisation } from './Organisation';
import { Person } from './Person';
import { TypeORMService } from '../libs/services/TypeORMService';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({
    nullable: true,
  })
  pictureURL: string;

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

  @OneToOne(() => Person, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  person: Person;

  @ManyToOne(() => Person, (person) => person.responsible_of,{
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'responsiblePersonId' })
  person_responsible: Person;

  // ----------------------------- Timestamps

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

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
      where: { id: this.id },
      relations: ['staffs'],
    });
    const staffs = currentUser.staffs;

    if (!staffs || staffs.length < 1) {
      return null;
    }

    const loadedStaff = await TypeORMService.getInstance()
      .getRepository(Staff)
      .findOneOrFail({
        where: {
          id: staffs[0].id,
        },
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
