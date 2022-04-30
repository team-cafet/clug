import { IRouter } from 'express';
import PromiseRouter from 'express-promise-router';
import { UserController } from '../../controllers/backoffice/user';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { Permissions } from '../../config/auth';

export const backofficeUserRouter = (): IRouter => {
  const app = PromiseRouter();
  const userController = new UserController();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    [Permissions.admin],
  ]);

  const readPermission = guard.check([
    [Permissions.admin],
  ]);
 
  app.get('/', readPermission, userController.getAll); 
  
  return app;
};
