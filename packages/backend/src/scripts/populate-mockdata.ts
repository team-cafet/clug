// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository } from 'typeorm';

// App
import { User, Member, Club, Address, Membership } from '../app/entities';
import { FinancialStatus, Sexe } from '../app/entities/member.entity';

export const schema = {
  additionalProperties: false,
  properties: {},
  required: [],
  type: 'object'
};

const clearTable = async () => {
  const tabEntity = [
    Member,
    User,
    Group,
    Permission,
    Club,
    Address,
    Membership
  ];
  let repo;

  tabEntity.forEach(entity => {
    repo = getRepository(entity);
    repo.query(`TRUNCATE public.${repo.metadata.tableName} CASCADE`);
  });
};

const createMockPermission = async () => {
  const permRepo = getRepository(Permission);

  return await permRepo.save([
    { codeName: 'member_read', name: 'member_read' },
    { codeName: 'member_write', name: 'member_write' },
    { codeName: 'invoice_read', name: 'invoice_read' },
    { codeName: 'invoice_write', name: 'invoice_write' },
    { codeName: 'user_read', name: 'user_read' },
    { codeName: 'user_write', name: 'user_write' }
  ]);
};

const createMockGroup = async (tabPerm: Permission[]) => {
  const groupRepo = getRepository(Group);

  let mr = tabPerm.find(perm => perm.name === 'member_read') || {};
  let mw = tabPerm.find(perm => perm.name === 'member_write') || {};
  let ir = tabPerm.find(perm => perm.name === 'invoice_read') || {};
  let ur = tabPerm.find(perm => perm.name === 'user_read') || {};

  return await groupRepo.save([
    {
      codeName: 'grp_mem',
      name: 'Membership',
      permissions: [mr, mw, ir, ur]
    },
    {
      codeName: 'grp_adm',
      name: 'Admin',
      permissions: tabPerm
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
  let tabPerm: Permission[];

  await createConnection();

  try {
    await clearTable();
  } catch (e) {
    console.error('Error on clearing table:', e);
    return;
  }

  // ----- PERMISSION MOCK
  try {
    tabPerm = await createMockPermission();
  } catch (e) {
    console.error('Error on creating permissions:', e);
    return;
  }

  // ----- GROUP MOCK
  try {
    await createMockGroup(tabPerm);
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
