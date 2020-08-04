import { IRouter } from 'express';
import { PaymentRequestCtrl } from '../controllers/payment-request';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const paymentRequestRouter = (): IRouter => {
  const app = PromiseRouter();
  const paymentRequestCtrl = new PaymentRequestCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    ['admin'],
    ['paymentRequest:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['paymentRequest:read']
  ]);

  app.get('/', readPermission ,async (req, res) => {
    const data = await paymentRequestCtrl.findAll();
    res.send(data);
    
  });

  app.get('/:id', readPermission ,async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await paymentRequestCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res) => {
    const data = await paymentRequestCtrl.store(req.body);
    res.send(data);
  });

  return app;
};
