import { createConnection, getManager, /*getRepository*/ } from 'typeorm';
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    groups: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args) {
  const user = new User();
  user.email = args.email;
  await user.setPassword(args.password);
  await createConnection();

  try {
    console.log(
      await getManager().save(user)
    );
  } catch (error) {
    console.log(error.message);
  }
}
