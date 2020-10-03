import { IRouter } from 'express';
import { MemberLabelCtrl } from '../controllers/member-label';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { Permissions } from '../config/auth';

export const memberLabelRouter = (): IRouter => {
  const app = PromiseRouter();
  const memberLabelCtrl = new MemberLabelCtrl();
  const guard = ExpressJWTPermissions();
  
  const writePermission = guard.check([
    [Permissions.admin],
    [Permissions.memberLabelW]
  ]);

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.memberLabelR]
  ]);

  app.get('/', readPermission, memberLabelCtrl.getAll);
  app.get('/:id', readPermission, memberLabelCtrl.getOne);
  app.post('/', writePermission, memberLabelCtrl.post);
  app.put('/:id', writePermission, memberLabelCtrl.put);
  app.delete('/:id', writePermission, memberLabelCtrl.delete);

  return app;
};
