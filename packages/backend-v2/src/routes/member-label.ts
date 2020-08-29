import { IRouter } from 'express';
import { MemberLabelCtrl } from '../controllers/member-label';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const memberLabelRouter = (): IRouter => {
  const app = PromiseRouter();
  const memberLabelCtrl = new MemberLabelCtrl();
  const guard = ExpressJWTPermissions();
  
  const writePermission = guard.check([
    ['admin'],
    ['memberLabel:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['memberLabel:read']
  ]);

  app.get('/', readPermission, memberLabelCtrl.getAll);
  app.get('/:id', readPermission, memberLabelCtrl.getOne);
  app.post('/', writePermission, memberLabelCtrl.post);
  app.put('/:id', writePermission, memberLabelCtrl.put);
  app.delete('/:id', writePermission, memberLabelCtrl.delete);

  return app;
};
