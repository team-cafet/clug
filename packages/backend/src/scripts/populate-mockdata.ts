// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository } from 'typeorm';

// App
import { User, Member, Club } from '../app/entities';
import { FinancialStatus, Sexe } from '../app/entities/member.entity';

export const schema = {
  additionalProperties: false,
  properties: {},
  required: [],
  type: 'object'
};

const clearTable = async () => {
  const membRpo = getRepository(Member);
  const userRepo = getRepository(User);
  const groupRepo = getRepository(Group);
  const permRepo = getRepository(Permission);

  await membRpo.query(`TRUNCATE public.${membRpo.metadata.tableName} CASCADE`);
  await userRepo.query(
    `TRUNCATE public.${userRepo.metadata.tableName} CASCADE`
  );
  await groupRepo.query(
    `TRUNCATE public.${groupRepo.metadata.tableName} CASCADE`
  );
  await permRepo.query(
    `TRUNCATE public.${permRepo.metadata.tableName} CASCADE`
  );
};

const createMockPermission = async () => {
  const permRepo = getRepository(Permission);

  return await permRepo.save([
    { codeName: 'mr', name: 'member_read' },
    { codeName: 'mw', name: 'member_write' },
    { codeName: 'ir', name: 'invoice_read' },
    { codeName: 'iw', name: 'invoice_write' },
    { codeName: 'ur', name: 'user_read' },
    { codeName: 'uw', name: 'user_write' }
  ]);
};

const createMockGroup = async () => {
  const groupRepo = getRepository(Group);
  return await groupRepo.save([
    {
      codeName: 'grp_mem',
      name: 'Membership',
      permissions: [
        { name: 'member_read' },
        { name: 'member_write' },
        { name: 'invoice_read' },
        { name: 'user_read' }
      ]
    },
    {
      codeName: 'grp_adm',
      name: 'Admin',
      permissions: [
        { name: 'member_read' },
        { name: 'member_write' },
        { name: 'invoice_read' },
        { name: 'invoice_write' },
        { name: 'user_read' },
        { name: 'user_write' }
      ]
    }
  ]);
};

const createUserMock = async () => {
  const ADMIN_GROUP = await getRepository(Group).findOne({ name: 'Admin' });

  const usrAdmin = new User();
  usrAdmin.email = 'admin@test.ch';
  await usrAdmin.setPassword('1234');
  usrAdmin.groups = ADMIN_GROUP ? [ADMIN_GROUP] : [];

  getManager().save(usrAdmin);
};

const createMemberMock = async () => {
  const membRepo = getRepository(Member);
  const clubRepo = getRepository(Club);

  let club1: Club;

  [club1] = await clubRepo.save([{ designation: 'Club 1' }]);

  return await membRepo.save([
    { surname: 'Geralt', name: 'Of Rivia', email: 'geralt@rivia.com' },
    {
      surname: 'Yennefer',
      name: 'Of Vanderberg',
      email: 'yen@vanderberg.com',
      sexe: Sexe.FEMALE,
      phone: '+01 12 123 45 67',
      birthdate: '2019-01-12',
      financialStatus: FinancialStatus.WARNING,
      club: club1,
      address: {
        street: 'chemin de montétan',
        streetNumber: 1,
        city: 'Lausanne',
        postalCode: 1004,
        country: 'Switzerland'
      }
    },
    {
      name: 'Of Cyntra',
      surname: 'Cyrila',
      email: 'cirla@cyntra.com',
      sexe: Sexe.FEMALE,
      phone: '+01 12 123 45 67',
      birthdate: '2000-01-12',
      financialStatus: FinancialStatus.OK,
      club: club1,
      address: {
        street: 'Rue de la Borde',
        streetNumber: 1,
        city: 'Lausanne',
        postalCode: 1004,
        country: 'Switzerland'
      }
    }
  ]);
};

export async function main(args) {
  await createConnection();

  try {
    await clearTable();
  } catch (e) {
    console.error('Error on clearing table:', e);
    return;
  }

  // ----- PERMISSION MOCK
  try {
    await createMockPermission();
  } catch (e) {
    console.error('Error on creating permissions:', e);
    return;
  }

  // ----- GROUP MOCK
  try {
    await createMockGroup();
  } catch (e) {
    console.error('Error on creating groups:', e);
    return;
  }

  // ----- USER MOCK
  try {
    await createUserMock();
  } catch (e) {
    console.error('Error on creating users:', e);
    return;
  }

  // ----- MEMBER MOCK
  try {
    await createMemberMock();
  } catch (e) {
    console.error('Error on creating members:', e);
    return;
  }
}
