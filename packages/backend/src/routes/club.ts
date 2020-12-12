import { IRouter } from 'express';
import { ClubCtrl } from '../controllers/club';
import PromiseRouter from 'express-promise-router';
import ExpressJWTPermissions from 'express-jwt-permissions';
import { Permissions } from '../config/auth';

export const clubRouter = (): IRouter => {
  const app = PromiseRouter();
  const clubCtrl = new ClubCtrl();
  const guard = ExpressJWTPermissions();

  const writePermission = guard.check([
    [Permissions.admin],
    [Permissions.clubW]
  ]);

  const readPermission = guard.check([
    [Permissions.admin],
    [Permissions.clubR]
  ]);

  app.get('/', readPermission, clubCtrl.getAll);
  app.get('/:id', readPermission, clubCtrl.getOne);
  app.post('/', writePermission, clubCtrl.post);
  app.put('/:id', writePermission, clubCtrl.put);
  app.delete('/:id', writePermission, async (req, res, next) => {
    const canUpdateOrDelete = await clubCtrl.canUpdateOrDelete(req, res);

    if (!canUpdateOrDelete) {
      return res
        .status(403)
        .send('You do not have permission to delete this clubs');
    }

    return clubCtrl.delete(req, res);
  });

  return app;
};
