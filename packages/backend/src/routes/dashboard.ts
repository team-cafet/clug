import { Router, IRouter } from 'express';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { DashboardCtrl } from '../controllers/dashboard';
import { Permissions } from '../config/auth';

export const dashboardRouter = (): IRouter => {
  const app = PromiseRouter();
  const dashboardCtrl = new DashboardCtrl();
  const guard = ExpressJWTPermissions();

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.memberR]
  ]);

  app.get('/', readPermission, dashboardCtrl.getAll);

  return app;
};
