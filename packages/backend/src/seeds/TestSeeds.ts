import { Organisation } from '../models/Organisation';
import { Staff } from '../models/Staff';
import { Member } from '../models/Member';
import { Group } from '../models/Group';
import { EXISTING_GROUPS } from '../config/auth';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { PaymentRequest } from '../models/PaymentRequest';
import { Membership } from '../models/Membership';
import { MembershipPlan, PlanType } from '../models/MembershipPlan';
import { Person } from '../models/Person';
import { TypeORMService } from '../libs/services/TypeORMService';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const executeTestSeeder = async () => {
  const getRepository = TypeORMService.getInstance().getRepository;

  const userRepo = getRepository(User);
  const staffRepo = getRepository(Staff);
  const memberRepo = getRepository(Member);
  const paymentRepo = getRepository(Payment);
  const paymentRequestRepo = getRepository(PaymentRequest);
  const membershipRepo = getRepository(Membership);
  const membershipPlanRepo = getRepository(MembershipPlan);

  const [adminGrp, managerGrp, userGrp] = await getRepository(Group).save([
    { name: EXISTING_GROUPS.ADMIN },
    { name: EXISTING_GROUPS.MANAGER },
    { name: EXISTING_GROUPS.USER },
  ]);

  const [org1, org2] = await getRepository(Organisation).save([
    { name: 'Organisation 1' },
    { name: 'Organisation 2' },
  ]);

  const [admin, manager] = await userRepo.save(
    userRepo.create([
      {
        person: { email: 'admin@test.ch' },
        username: 'admin',
        password: '1234',
        group: adminGrp,
      },
      {
        person: { email: 'admin@test.ch' },
        username: 'manager',
        password: '1234',
        group: managerGrp,
      },
    ])
  );

  const [staff1, staff2] = await staffRepo.save(
    staffRepo.create([
      {
        user: {
          person: { email: 'admin@test.ch' },
          username: 'staff',
          /* email: 'staff@test.ch', */
          password: '1234',
          group: userGrp,
        },
        organisation: org1,
      },
      {
        user: manager,
        organisation: org1,
      },
    ])
  );

  const [member1, member2] = await memberRepo.save(
    memberRepo.create([
      {
        user: {
          person: {
            email: 'admin@test.ch',
            firstname: 'PrénomTest',
            lastname: 'NomTest',
            city: 'Laus Angeles',
          },
          username: 'user-test',
          /* email: 'user@test.ch', */
          password: '1234',
          group: userGrp,
        },
        organisation: org1,
      },
      {
        user: { person: { email: 'admin@test.ch' }, password: '1234', group: userGrp },
        organisation: org2,
      },
    ])
  );

  await paymentRepo.save(
    paymentRepo.create([
      { member: member2, amount: 15, date: '2020-01-20' },
      { member: member1, amount: 10, date: '2020-01-25' },
    ])
  );

  await paymentRequestRepo.save(
    paymentRequestRepo.create([
      {
        amount: 15,
        date: '2020-01-20',
        description: 'Admin Request',
        user: admin,
        members: [member1, member2],
      },
      {
        amount: 10,
        date: '2020-01-25',
        description: 'Staff Request',
        user: staff1.user,
        members: [member1, member2],
      },
    ])
  );

  const [plan1, plan2] = await membershipPlanRepo.save(
    membershipPlanRepo.create([
      {
        type: PlanType.monthly,
        price: 100,
        organisation: org1,
        tacit: false,
      },
      {
        type: PlanType.annual,
        price: 800,
        organisation: org2,
        tacit: false,
      },
    ])
  );

  await membershipRepo.save(
    membershipRepo.create([
      {
        member: member1,
        startDate: '2020-01-01',
        endDate: '2020-02-01',
        plan: plan1,
      },
      {
        member: member2,
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        plan: plan2,
      },
    ])
  );

  return {
    users: {
      admin: admin,
      manager: manager,
    },
    organisations: [org1, org2],
    staff: [staff1],
    member: [member1, member2],
  };
};

/**
 * Will execute the seeder needed to have a clean app
 */
export const executeInitialConfigSeeder = async (): Promise<void> => {
  await TypeORMService.getInstance().getRepository(Group).save([
    { name: EXISTING_GROUPS.ADMIN },
    { name: EXISTING_GROUPS.MANAGER },
    { name: EXISTING_GROUPS.USER },
  ]);
};
