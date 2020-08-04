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

  app.get('/', readPermission, async (req, res, next) => {
    const data = await orgCtrl.findAll();
    res.send(data);
  });

  app.get('/:id', readPermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await orgCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res, next) => {
    const data = await orgCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await orgCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await orgCtrl.delete(id);
    res.send(data);
  });

  return app;
};
