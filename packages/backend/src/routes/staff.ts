import { Router, IRouter } from 'express';
import { StaffCtrl } from '../controllers/staff';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const staffRouter = (): IRouter => {
  const app = PromiseRouter();
  const staffCtrl = new StaffCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['staff:write']]);

  const readPermission = guard.check([['admin'], ['staff:read']]);

  app.get('/', readPermission, staffCtrl.getAll);
  app.get('/:id', readPermission, staffCtrl.getOne);
  app.post('/', writePermission, staffCtrl.post);
  app.put('/:id', writePermission, staffCtrl.put);
  app.delete('/:id', writePermission, staffCtrl.delete);

  return app;
};
