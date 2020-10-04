import { loadORM } from '../util/loadorm';
import { executeTestSeeder } from '../seeds';
import { connectionOptions } from '../config/database';

import { loadEnv } from '../util/loadenv';
import { getConnection } from 'typeorm';

(async () => {
  loadEnv();
  try {
    await loadORM({...connectionOptions(), dropSchema: true});

    await executeTestSeeder();

  } catch (error) {
    console.error(error);
  }

  getConnection().close();
})();
