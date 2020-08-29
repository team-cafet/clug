import { IRouter } from 'express';
import { ClubCtrl } from '../controllers/club';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const clubRouter = (): IRouter => {
  const app = PromiseRouter();
  const clubCtrl = new ClubCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['club:write']]);

  const readPermission = guard.check([['admin'], ['club:read']]);

  app.get('/', readPermission, clubCtrl.getAll);
  app.get('/:id', readPermission, clubCtrl.getOne);
  app.post('/', writePermission, clubCtrl.post);
  app.put('/:id', writePermission, clubCtrl.put);
  app.delete('/:id', writePermission, clubCtrl.delete);

  return app;
};
