import {
  getRepository,
} from 'typeorm';

import { NextFunction, Request, Response } from 'express';
import { RESTController } from './RESTController';
import { User } from '../../models/User';
import { EXISTING_GROUPS } from '../../config/auth';
import * as ControllerUtils from '../../util/controller-utils';
import { IResourceWithOrganisation } from '../interfaces/IResourceWithOrganisation';
import {APIMessageList} from './APIMessageList';


/**
 * Derived from the RESTController, this class is used to automatically apply
 * the filtering of organisation
 */
export class OrganisationRESTController<T extends IResourceWithOrganisation> extends RESTController<T>{
  

  /**
   * Custom getAll is needed here as we need to give only the resources from
   * the orgaisation
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
        ...(this.options?.findAllOptions ?? {}),
        where: { organisation: currentOrg.id },
      })
    );
  };

  /**
   * Custom getOne is needed here as we need to give only the resource which are in the
   * user organisation
   * @param req 
   * @param res 
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === EXISTING_GROUPS.ADMIN) {
      return res.send(await this.findOneByID(id, {
        ...(this.options?.findOneOptions ?? {})
      }));
    }
    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(req);

    return res.send(await this.findOneByID(id, {
      ...(this.options?.findOneOptions ?? {}),
      where: { organisation: currentOrg.id }
    }));
  }

  /**
   * Check if the user can update or delete the resource
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

    const [user, resource] = await Promise.all([
      getRepository(User).findOneOrFail(req.user.user.id),
      this.repository.findOneOrFail(id, { relations: ['organisation'] })
    ]);
    const userOrg = await user.getUserOrganisation();

    if (!user || !resource) {
      return res
        .status(404)
        .send(APIMessageList.NO_RESOURCE_FOUND);
    }

    if (resource.organisation?.id !== userOrg.id) {
      return res
        .status(403)
        .send(APIMessageList.NO_PERMISSION_TO_MODIFY);
    }

    next();
  };

  
}
