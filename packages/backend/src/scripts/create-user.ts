// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository, getConnection } from 'typeorm';

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
  required: ['email', 'password'],
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
    const permission = await getRepository(Permission).findOne({ codeName });
    if (!permission) {
      console.log(`No permission with the code name "${codeName}" was found.`);
      return;
    }
    user.userPermissions.push(permission);
  }

  for (const codeName of args.groups as string[]) {
    const group = await getRepository(Group).findOne({ codeName });
    if (!group) {
      console.log(`No group with the code name "${codeName}" was found.`);
      return;
    }
    user.groups.push(group);
  }
  console.log(user.groups.length)

  try {
    console.log(await getManager().save(user));
  } catch (error) {
    console.log(error.message);
  }
}
