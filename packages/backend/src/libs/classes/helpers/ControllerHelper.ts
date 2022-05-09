import { Request } from 'express';
import { User } from '../../../models/User';
import { Organisation } from '../../../models/Organisation';
import { TypeORMService } from '../../../libs/services/TypeORMService';

export class ControllerHelper {
  static async getCurrentOrgFromUserInRequest(req: Request): Promise<Organisation> {
    const userRepo = TypeORMService.getInstance().getRepository(User);
    const currentUser = await userRepo.findOne({ where:{id: req.user.user.id }});
    return currentUser.getUserOrganisation();
  }
}
