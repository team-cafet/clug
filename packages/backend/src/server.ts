import { initApp } from './app';
import boot from './boot';

boot().finally(() => {
  const app = initApp();
  app.listen(app.get('port'), () => {
    console.log(
      'App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });
});
