import { initApp } from './app';
import { loadORM } from './util/loadorm';
import { connectionOptions } from './config/database';
import {loadEnv} from './util/loadenv';

(async () => {
  try {
    loadEnv();
    await loadORM(connectionOptions());
    server();
  } catch (err) {
    console.log(err);
  }
})();

export const server = () => {
  const app = initApp();
  app.listen(app.get('port'), () => {
    console.log(
      'App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });
};
