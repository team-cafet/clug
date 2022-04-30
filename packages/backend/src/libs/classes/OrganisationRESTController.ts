import { NextFunction, Request, Response } from 'express';
import { RESTController } from './RESTController';
import { User } from '../../models/User';
import { EXISTING_GROUPS } from '../../config/auth';
import { IResourceWithOrganisation } from '../interfaces/IResourceWithOrganisation';
import {APIMessageList} from './APIMessageList';
import { TypeORMService } from '../services/TypeORMService';
import { ControllerHelper } from './helpers/ControllerHelper';


/**
 * Derived from the RESTController, this class is used to automatically apply
 * the filtering of organisation
 */
export class OrganisationRESTController<T extends IResourceWithOrganisation> extends RESTController<T>{
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.user.group === 'admin') {
      return res.send(await this.findAll());
    }

    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(req);

    return res.send(
      await this.findAll({
        ...(this.options?.findAllOptions ?? {}),
        where: { organisation: {id: currentOrg.id} },
      })
    );
  };

  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === EXISTING_GROUPS.ADMIN) {
      return res.send(await this.findOneByID(id, {
        ...(this.options?.findOneOptions ?? {})
      }));
    }
    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(req);

    return res.send(await this.findOneByID(id, {
      ...(this.options?.findOneOptions ?? {}),
      where: { organisation: {id: currentOrg.id} }
    }));
  };

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
      TypeORMService.getInstance().getRepository(User).findOneOrFail({where: {id: req.user.user.id}}),
      
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.repository.findOneOrFail({ where: { id }, relations: ['organisation'] })
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
