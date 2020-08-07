import { IRouter } from 'express';
import { MemberCtrl } from '../controllers/member';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { OrganisationCtrl } from '../controllers/organisation';
import { check } from 'express-validator';
import { Member } from '../models/Member';

export const memberRouter = (): IRouter => {
  const app = PromiseRouter();
  const memberCtrl = new MemberCtrl();
  const organisationCtrl = new OrganisationCtrl();
  const guard = ExpressJWTPermissions();

  const readPermission = guard.check([['admin'], ['member:read']]);
  const writePermission = guard.check([['admin'], ['member:write']]);

  app.get('/', readPermission, async (req, res, next) => {
    const data = await memberCtrl.findAll();
    res.send(data);
  });

  app.get('/:id', readPermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    const data = await memberCtrl.findOneByID(id);
    res.send(data);
  });

  app.post(
    '/',
    [writePermission, check('user.email').isEmail()],
    async (req, res, next) => {
      if (!(await organisationCtrl.findOneByID(req.body?.organisation?.id))) {
        res
          .status(404)
          .send(`No organisation found with id ${req.body?.organisation?.id}`);
        return;
      }

      if (
        !(await memberCtrl.isUserCanCreateMember(req.body, req.user.user.id))
      ) {
        res.status(403).send('You are not authorized to create this member');
        return;
      }

      const member = new Member();
      member.user = req.body.user;
      member.note = req.body.note;
      member.organisation = req.body.organisation;

      const data = await memberCtrl.store(member);
      res.send(data);
    }
  );

  app.put(
    '/:id',
    [writePermission, check('user.email').isEmail()],
    async (req, res, next) => {
      const id = Number.parseInt(req.params.id);

      if (!(await organisationCtrl.findOneByID(req.body?.organisation?.id))) {
        res
          .status(404)
          .send(`No organisation found with id ${req.body?.organisation?.id}`);
        return;
      }

      if (!(await memberCtrl.isUserCanUpdateMember(id, req.user.user.id))) {
        res.status(403).send('You are not authorized to update this member');
        return;
      }

      const member = new Member();
      member.user = req.body.user;
      member.note = req.body.note;
      member.organisation = req.body.organisation;

      const data = await memberCtrl.update(id, member);
      res.send(data);
    }
  );

  app.delete('/:id', writePermission, async (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    if (!(await memberCtrl.isUserCanUpdateMember(id, req.user.user.id))) {
      res.status(403).send('You are not authorized to update this member');
      return;
    }

    const data = await memberCtrl.delete(id);
    res.send(data);
  });

  return app;
};