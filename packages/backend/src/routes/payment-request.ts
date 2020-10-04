import { IRouter } from 'express';
import { PaymentRequestCtrl } from '../controllers/payment-request';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const paymentRequestRouter = (): IRouter => {
  const app = PromiseRouter();
  const paymentRequestCtrl = new PaymentRequestCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['paymentRequest:write']]);

  const readPermission = guard.check([['admin'], ['paymentRequest:read']]);

  app.get('/', readPermission, paymentRequestCtrl.getAll);
  app.get('/:id', readPermission, paymentRequestCtrl.getOne);
  app.post('/', writePermission, paymentRequestCtrl.post);
  
  return app;
};
