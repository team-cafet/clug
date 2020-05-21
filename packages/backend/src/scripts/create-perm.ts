// 3p
import { Permission } from '@foal/typeorm';
import { createConnection, getConnection, getManager } from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string' }
  },
  required: [ 'name', 'codeName' ],
  type: 'object'
};

export async function main(args: { codeName: string; name: string }) {
  const permission = new Permission();
  permission.codeName = args.codeName;
  permission.name = args.name;

  await createConnection();

  try {
    await getManager().save(permission);
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await getConnection().close();
  }
}
