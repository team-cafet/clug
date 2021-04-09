import { loadORM } from '../util/loadorm';
import { executeTestSeeder } from '../seeds/TestSeeds';
import { connectionOptions } from '../config/database';

import { loadEnv } from '../util/loadenv';
import { getConnection } from 'typeorm';

(async () => {
  loadEnv();
  try {
    await loadORM({...connectionOptions()});

    await executeTestSeeder();

  } catch (error) {
    console.error(error);
  }

  getConnection().close();
})();
