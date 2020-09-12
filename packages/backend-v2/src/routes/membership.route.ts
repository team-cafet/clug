import { IRouter } from 'express';
import { MembershipCtrl } from '../controllers/membership';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import logger from '../util/logger';

export const membershipRouter = (): IRouter => {
  const app = PromiseRouter();
  const membershipCtrl = new MembershipCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['Membership:write']]);

  const readPermission = guard.check([['admin'], ['Membership:read']]);

  app.get('/', readPermission, membershipCtrl.getAll);
  app.get('/notPaid', readPermission, membershipCtrl.getNotPaid);
  app.get('/:id', readPermission, membershipCtrl.getOne);
  app.post(
    '/',
    writePermission,
    membershipCtrl.businessValidation,
    membershipCtrl.post
  );
  app.put('/:id', writePermission, membershipCtrl.put);
  app.delete('/:id', writePermission, membershipCtrl.delete);

  return app;
};
