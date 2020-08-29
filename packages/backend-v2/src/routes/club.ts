import { IRouter } from 'express';
import { ClubCtrl } from '../controllers/club';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const clubRouter = (): IRouter => {
  const app = PromiseRouter();
  const clubCtrl = new ClubCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([['admin'], ['club:write']]);

  const readPermission = guard.check([['admin'], ['club:read']]);

  app.get('/', readPermission, async (req, res) => {
    const data = await clubCtrl.findAll();
    res.send(data);
  });

  app.get('/:id', readPermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await clubCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res) => {
    const data = await clubCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await clubCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await clubCtrl.delete(id);
    res.send(data);
  });

  return app;
};
