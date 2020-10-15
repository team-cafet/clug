import { IRouter } from 'express';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { MembershipPlanCtrl } from '../controllers/membership-plan';
import { Permissions } from '../config/auth';

export const membershipPlanRouter = (): IRouter => {
  const app = PromiseRouter();
  const membershipPlanCtrl = new MembershipPlanCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    [Permissions.admin],
    [Permissions.membershipPlanW]
  ]);

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.membershipPlanW]
  ]);

  app.get('/', readPermission, membershipPlanCtrl.getAll);
  app.get('/types', readPermission, membershipPlanCtrl.getAllTypes);
  app.get('/:id', readPermission, membershipPlanCtrl.getOne);
  app.post('/', writePermission, membershipPlanCtrl.post);
  app.put('/:id', writePermission, membershipPlanCtrl.put);
  app.delete('/:id', writePermission, membershipPlanCtrl.delete);

  return app;
};
