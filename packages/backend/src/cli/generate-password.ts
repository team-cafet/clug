import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from '../config/auth';

exports.command = 'generate-password <password>';
exports.desc = 'Generate the hash from a password';
exports.builder = {
  password: {
    alias: ['p'],
    type: 'string',
    describe: '',
  },
};

exports.handler = async function (argv) {
  try {
    console.log(await hash(argv.password, BCRYPT_SALT_ROUND));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
