import { exit } from 'process';
import { createUser } from './scripts/create-user';

const [, , COMMAND, ...args] = process.argv;

if(!COMMAND) {
  console.log('No command provided...');
  exit();
}

switch (COMMAND) {
  case 'create-user':
    if (!args[0]) exit();

    createUser(JSON.parse(args[0]));
    break;

  default:
    console.log('Uknown command provided...');
    break;
}
