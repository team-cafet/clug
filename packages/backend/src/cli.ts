import { createUser } from './scripts/create-user';
import yargs from 'yargs';

yargs
  .scriptName('clug')
  .usage('$0 <cmd> [args]')
  .command(
    'create-user [name, password, groupid]',
    'A command to create a new user in the database',
    (yargs) => {
      yargs
        .positional('email', {
          alias: ['e'],
          type: 'string',
          default: '',
          describe: ''
        })
        .positional('username', {
          alias: ['u'],
          type: 'string',
          default: '',
          describe: ''
        })
        .positional('password', {
          alias: ['p'],
          type: 'string',
          default: '',
          describe: ''
        })
        .positional('groupId', {
          alias: ['g'],
          type: 'number',
          default: '',
          describe: ''
        });
    },
    async (argv) => {
      try {
        const user = await createUser({        
          email: argv.email as string,  
          username: argv.username as string,
          password: argv.password as string,
          group: argv.groupId
        });
        console.log(`user "${JSON.stringify(user.username)}" successfully created !`);
        process.exit();
      } catch (err) {
        console.error(err);
        process.exit();
      }
    }
  )
  .help().argv;
