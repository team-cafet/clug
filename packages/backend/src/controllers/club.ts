import { RESTController } from '../libs/classes/RESTController';
import { getRepository } from 'typeorm';
import { Club } from '../models/Club';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';

export class ClubCtrl extends RESTController<Club> {
  constructor() {
    super(getRepository(Club));
  }

  public canUpdateOrDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === 'admin') {
      next();
    }

    const [user, club] = await Promise.all([
      getRepository(User).findOneOrFail(req.user.user.id),
      this.repository.findOneOrFail(id, { relations: ['organisation'] })
    ]);
    const userOrg = await user.getUserOrganisation();

    if (!user || !club) {
      return res
      .status(403)
      .send('You do not have permission to modify this club');
    }

    if (club.organisation.id !== userOrg.id) {
      return res
      .status(403)
      .send('You do not have permission to modify this club');
    }

    next();
  };

}
