import { connectionOptions } from '../config/database';
import { loadEnv } from '../util/loadenv';
import { loadORM } from '../util/loadorm';
import { DatabaseSeeds } from '../seeds/DatabaseSeeds';

(async () => {
  loadEnv();
  try {
    await loadORM({...connectionOptions()});
    console.log('launching...');
    await new DatabaseSeeds().run();
  } catch (err) {
    console.error(err);
  }
})();
