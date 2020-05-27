// 3p
import { Group, Permission } from '@foal/typeorm';
import {
  createConnection,
  getConnection,
  getManager,
  getRepository
} from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 80 },
    permissions: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: []
    }
  },
  required: [ 'name', 'codeName' ],
  type: 'object'
};

export async function main(args: {
  codeName: string;
  name: string;
  permissions: string[];
}) {
  const group = new Group();
  group.permissions = [];
  group.codeName = args.codeName;
  group.name = args.name;

  await createConnection();

  for (const codeName of args.permissions) {
    // eslint-disable-next-line no-await-in-loop
    const permission = await getRepository(Permission).findOne({ codeName });
    if (!permission) {
      throw new Error(`No permission with the code name "${codeName}" was found.`);
    }
    group.permissions.push(permission);
  }

  try {
    await getManager().save(group);
  } catch (error) {
    throw new Error(error);
  } finally {
    await getConnection().close();
  }
}
