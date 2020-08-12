import { IRouter } from 'express';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { MembershipPlanCtrl } from '../controllers/membershipPlan.controller';

export const membershipPlanRouter = (): IRouter => {
  const app = PromiseRouter();
  const membershipPlanCtrl = new MembershipPlanCtrl();
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
    const data = await membershipPlanCtrl.findAll();
    res.send(data);
    
  });

  app.get('/:id', readPermission , async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipPlanCtrl.findOneByID(id);
    res.send(data);
  });

  app.post('/', writePermission, membershipPlanCtrl.businessValidation,async (req, res) => {
    const data = await membershipPlanCtrl.store(req.body);
    res.send(data);
  });

  app.put('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipPlanCtrl.update(id, req.body);
    res.send(data);
  });

  app.delete('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const data = await membershipPlanCtrl.delete(id);
    res.send(data);
  });

  return app;
};
