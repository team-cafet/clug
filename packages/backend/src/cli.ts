import yargs from 'yargs';
import boot from './boot';

boot().finally(() => {
  yargs(process.argv.slice(2))
    .commandDir('./cli')
    .demandCommand()
    .help().argv;
});
