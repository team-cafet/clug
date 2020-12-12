import { RESTController } from '../libs/classes/RESTController';
import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { MembershipPlan, PlanType } from '../models/MembershipPlan';
import { User } from '../models/User';

export class MembershipPlanCtrl extends RESTController<MembershipPlan> {
  constructor() {
    super(getRepository(MembershipPlan));
  }

  /**
   * 
   * @param req 
   * @param res 
   */
  public getAllTypes = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return res
      .status(201)
      .send(Object.values(PlanType).filter((type) => typeof type === 'string')); //Return the list of type's names. We probably have to do a refactoring about membershipplan's types like have a specific table in the db.
  };

  /**
   * 
   * @param req 
   * @param res 
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.user.group === 'admin') {
      return res.send(await this.findAll());
    }

    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(req.user.user.id);
    const currentOrg = await currentUser.getUserOrganisation();

    return res.send(
      await this.findAll({
        where: { organisation: currentOrg.id }
      })
    );
  };

  /**
   * 
   * @param req 
   * @param res 
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === 'admin') {
      return res.send(await this.repository.findOneOrFail(id, {}));
    }

    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(req.user.user.id);
    const currentOrg = await currentUser.getUserOrganisation();

    return res.send(
      await this.repository.findOneOrFail(id, {
        where: { organisation: currentOrg.id }
      })
    );
  };

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public canUpdateOrDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === 'admin') {
      next();
    }

    const [user, membershipPlan] = await Promise.all([
      getRepository(User).findOneOrFail(req.user.user.id),
      this.repository.findOneOrFail(id, { relations: ['organisation'] })
    ]);
    const userOrg = await user.getUserOrganisation();

    if (!user || !membershipPlan) {
      return res
        .status(403)
        .send('You do not have permission to modify this plan');
    }

    if (membershipPlan.organisation.id !== userOrg.id) {
      return res
        .status(403)
        .send('You do not have permission to modify this plan');
    }

    next();
  };
}
