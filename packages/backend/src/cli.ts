import yargs from 'yargs';
import { loadORM } from './util/loadorm';
import { loadEnv } from './util/loadenv';

loadEnv();
loadORM().finally(() => {
  yargs
    .scriptName('clug')
    .usage('$0 <cmd> [args]')
    .commandDir('./cli')
    .demandCommand()
    .help().argv;
});
