import { IRouter } from 'express';
import { MembershipCtrl } from '../controllers/membership';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { Permissions } from '../config/auth';

export const membershipRouter = (): IRouter => {
  const app = PromiseRouter();
  const membershipCtrl = new MembershipCtrl();
  const guard = ExpressJWTPermissions();

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.membershipR]
  ]);
  const writePermission = guard.check([
    [Permissions.admin],
    [Permissions.membershipW]
  ]);


  app.get('/notPaid', readPermission, membershipCtrl.getNotPaid);
  app.get('/', readPermission, membershipCtrl.getAll);
  app.get('/:id', readPermission, membershipCtrl.getOne);
  app.post(
    '/',
    writePermission,
    membershipCtrl.businessValidation,
    membershipCtrl.postOne
  );
  app.put('/:id', writePermission, membershipCtrl.businessValidation, membershipCtrl.put);
  app.delete('/:id', writePermission, membershipCtrl.terminateMembership);

  return app;
};
