import { IRouter } from 'express';
import { PaymentCtrl } from '../controllers/payment';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const paymentRouter = (): IRouter => {
  const app = PromiseRouter();
  const paymentCtrl = new PaymentCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['payment:write']]);

  const readPermission = guard.check([['admin'], ['payment:read']]);

  app.get('/', readPermission, paymentCtrl.getAll);
  app.get('/:id', readPermission, paymentCtrl.getOne);
  app.post('/', writePermission, paymentCtrl.post);
  
  return app;
};
