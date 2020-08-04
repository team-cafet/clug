import { loadORM } from '../util/loadorm';
import { executeTestSeeder } from '../seeds';
import { connectionOptions } from '../config/database';

import { loadEnv } from '../util/loadenv';
import { getConnection } from 'typeorm';

(async () => {
  loadEnv();
  await loadORM(connectionOptions());

  await executeTestSeeder();
  getConnection().close();
})();
