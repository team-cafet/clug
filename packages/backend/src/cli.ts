import yargs from 'yargs';
import { loadORM } from './util/loadorm';
import { loadEnv } from './util/loadenv';

loadEnv();
loadORM().finally(() => {
  yargs(process.argv.slice(2))
    .commandDir('./cli')
    .demandCommand()
    .help().argv;
});
