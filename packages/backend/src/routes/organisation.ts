import { Router, IRouter } from 'express';
import { OrganisationCtrl } from '../controllers/organisation';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const organisationRouter = (): IRouter => {
  const app = PromiseRouter();
  const orgCtrl = new OrganisationCtrl();
  const guard = ExpressJWTPermissions();
  
  const writePermission = guard.check([
    ['admin'],
    ['organisation:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['organisation:read']
  ]);

  app.get('/', readPermission, orgCtrl.getAll);
  app.get('/:id', readPermission, orgCtrl.getOne);
  app.post('/', writePermission, orgCtrl.post);
  app.put('/:id', writePermission, orgCtrl.put);
  app.delete('/:id', writePermission, orgCtrl.delete);

  return app;
};
