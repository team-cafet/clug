import { IRouter } from 'express';
import { PaymentCtrl } from '../controllers/payment';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const paymentRouter = (): IRouter => {
  const app = PromiseRouter();
  const paymentCtrl = new PaymentCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    ['admin'],
    ['payment:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['payment:read']
  ]);

  app.get('/', readPermission ,async (req, res) => {
    const data = await paymentCtrl.findAll();
    res.send(data);
    
  });

  app.get('/:id', readPermission ,async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await paymentCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res) => {
    const data = await paymentCtrl.store(req.body);
    res.send(data);
  });

  return app;
};
