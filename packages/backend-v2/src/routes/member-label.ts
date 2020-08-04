import { IRouter } from 'express';
import { MemberLabelCtrl } from '../controllers/member-label';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';

export const memberLabelRouter = (): IRouter => {
  const app = PromiseRouter();
  const memberLabelCtrl = new MemberLabelCtrl();
  const guard = ExpressJWTPermissions();
  
  const writePermission = guard.check([
    ['admin'],
    ['memberLabel:write']
  ]);

  const readPermission = guard.check([
    ['admin'],
    ['memberLabel:read']
  ]);

  app.get('/', readPermission, async (req, res) => {
    const data = await memberLabelCtrl.findAll();
    res.send(data);
  });

  app.get('/:id', readPermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await memberLabelCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, async (req, res) => {
    const data = await memberLabelCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await memberLabelCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await memberLabelCtrl.delete(id);
    res.send(data);
  });

  return app;
};
