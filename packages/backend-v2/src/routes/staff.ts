import { Router, IRouter } from 'express';
import { StaffCtrl } from '../controllers/staff';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const staffRouter = (): IRouter => {
  const app = PromiseRouter();
  const staffCtrl = new StaffCtrl();
  const guard = ExpressJWTPermissions();
  
  const writePermission = guard.check([
    ['admin'],
    ['staff:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['staff:read']
  ]);

  app.get('/', readPermission, async (req, res, next) => {
    const data = await staffCtrl.findAll();
    res.send(data);
  });

  app.get('/:id', readPermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await staffCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res, next) => {
    const data = await staffCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await staffCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await staffCtrl.delete(id);
    res.send(data);
  });

  return app;
};
