import { RESTController } from '../libs/classes/RESTController';
import { MemberLabel } from '../models/MemberLabel';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../models/User';

export class MemberLabelCtrl extends RESTController<MemberLabel> {

  constructor(){    
    super(getRepository(MemberLabel));
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.user.group === 'admin') {
      return res.send(await this.findAll());
    }
    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(req.user.user.id);

    const currentOrg = await currentUser.getUserOrganisation();

    return res.send(
      await this.findAll({
        where: { organisation: currentOrg.id },
      })
    );
  };

  public canUpdateOrDelete = async (req: Request, res: Response): Promise<boolean> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === 'admin') {
      return true;
    }

    const [user, label] = await Promise.all(
      [getRepository(User).findOneOrFail(req.user.user.id),
        this.repository.findOneOrFail(id, {relations:['organisation']})]);
    const userOrg = await user.getUserOrganisation();

    if(!user || !label){
      return false;
    }
    
    if(label.organisation.id !== userOrg.id){
      return false;
    }

    return true;
  }
}