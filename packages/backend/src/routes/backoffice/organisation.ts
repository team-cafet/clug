import { IRouter } from 'express';
import PromiseRouter from 'express-promise-router';
import { OrganisationController } from '../../controllers/backoffice/organisation';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { Permissions } from '../../config/auth';

export const backofficeOrganisationRouter = (): IRouter => {
  const app = PromiseRouter();
  const organisationController = new OrganisationController();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    [Permissions.admin],
  ]);

  const readPermission = guard.check([
    [Permissions.admin],
  ]);
 
  app.get('/', readPermission, organisationController.getAll); 

  app.post('/with-user', writePermission, organisationController.createNewOrganisationAndUser); 
  
  return app;
};
