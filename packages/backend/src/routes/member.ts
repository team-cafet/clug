import { IRouter } from 'express';
import { MemberCtrl } from '../controllers/member';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { OrganisationCtrl } from '../controllers/organisation';
import { check } from 'express-validator';
import { Member } from '../models/Member';
import { Permissions } from '../config/auth';
import { fileConfig } from '../config/file';

export const memberRouter = (): IRouter => {
  const app = PromiseRouter();
  const memberCtrl = new MemberCtrl();
  const organisationCtrl = new OrganisationCtrl();
  const guard = ExpressJWTPermissions();
  const upload = fileConfig().multer.memberpicture;

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.memberR]
  ]);
  const writePermission = guard.check([
    [Permissions.admin],
    [Permissions.memberW],
  ]);

  app.get('/', readPermission, memberCtrl.getAll);
  
  app.get('/picture/:filename', readPermission, memberCtrl.getPicture);

  app.get('/:id', readPermission, memberCtrl.getOne);

  app.post(
    '/',
    [writePermission, check('user.person.email').isEmail()],
    async (req, res) => {
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
      member.memberships = req.body.memberships;

      const data = await memberCtrl.storeWithMembership(member);
      res.send(data);
    }
  );

  app.post('/picture', [writePermission], upload.single('picture'), memberCtrl.postPicture);

  app.put(
    '/:id',
    [writePermission, check('user.person.email').isEmail()],
    memberCtrl.putAndCheckResponsible
  );

  app.delete('/:id', writePermission, async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!(await memberCtrl.isUserCanUpdateMember(id, req.user.user.id))) {
      res.status(403).send('You are not authorized to update this member');
      return;
    }

    const data = await memberCtrl.remove(id);
    res.send(data);
  });

  return app;
};
