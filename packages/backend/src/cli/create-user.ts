import { DeepPartial, getRepository } from 'typeorm';

import { User } from '../models/User';

const createUser = async (data: DeepPartial<User>): Promise<User> => {
  const userRepo = getRepository(User);
  const userData = userRepo.create([data]);
  return userData[0].save();
};

exports.command = 'create-user <name> <email> <password> <groupid>';
exports.desc = 'A command to create a new user in the database';
exports.builder = {
  email: {
    alias: ['e'],
    type: 'string',
    describe: '',
    required: ''
  },
  username: {
    alias: ['u'],
    type: 'string',
    describe: '',
    require: ''
  },
  password: {
    alias: ['p'],
    type: 'string',
    describe: '',
  },
  groupId: {
    alias: ['g'],
    type: 'number',
    describe: '',
  },
};

exports.handler = async function (argv) {
  try {
    console.log('Creating user....');
    const user = await createUser({
      email: argv.email as string,
      username: argv.username as string,
      password: argv.password as string,
      group: argv.groupId,
    });
    console.log(
      `user "${JSON.stringify(user.username)}" successfully created !`
    );
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
