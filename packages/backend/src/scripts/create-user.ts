// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    groups: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: []
    },
    password: { type: 'string' },
    userPermissions: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: []
    }
  },
  required: [ 'email', 'password' ],
  type: 'object'
};

export async function main(args) {
  const user = new User();
  user.userPermissions = [];
  user.groups = [];
  user.email = args.email;

  await user.setPassword(args.password);

  await createConnection();

  for (const codeName of args.userPermissions as string[]) {
    // eslint-disable-next-line no-await-in-loop
    const permission = await getRepository(Permission).findOne({ codeName });
    if (!permission) {
      throw new Error(`No permission with the code name "${codeName}" was found.`);
    }
    user.userPermissions.push(permission);
  }

  for (const codeName of args.groups as string[]) {
    // eslint-disable-next-line no-await-in-loop
    const group = await getRepository(Group).findOne({ codeName });
    if (!group) {
      throw new Error(`No group with the code name "${codeName}" was found.`);
    }
    user.groups.push(group);
  }

  try {
    await getManager().save(user);
  } catch (error) {
    throw new Error(error.message);
  }
}
