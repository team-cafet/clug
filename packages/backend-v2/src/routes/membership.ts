import { IRouter } from 'express';
import { MembershipCtrl } from '../controllers/membership';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const membershipRouter = (): IRouter => {
  const app = PromiseRouter();
  const membershipCtrl = new MembershipCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    ['admin'],
    ['Membership:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['Membership:read']
  ]);

  app.get('/', readPermission ,async (req, res) => {
    const data = await membershipCtrl.findAll();
    res.send(data);
    
  });

  app.get('/:id', readPermission ,async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res) => {
    const data = await membershipCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipCtrl.delete(id);
    res.send(data);
  });

  return app;
};
