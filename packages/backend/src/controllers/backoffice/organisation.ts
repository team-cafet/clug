import { Organisation } from '../../models/Organisation';
import { RESTController } from '../../libs/classes/RESTController';
import { Request, Response } from 'express';
import { APIError } from '../../libs/classes/APIError';
import { Staff } from '../../models/Staff';
import { Group } from '../../models/Group';
import { EXISTING_GROUPS } from '../../config/auth';
import { User } from '../../models/User';
import { TypeORMService } from '../../libs/services/TypeORMService';

export class OrganisationController extends RESTController<Organisation> {
  constructor() {
    super(Organisation);
  }
  
  public findAll(): Promise<Organisation[]> {
    return super.findAll({
      relations: [
        'staffs'
      ]
    });
  }
  
  public async createNewOrganisationAndUser(req: Request, res: Response): Promise<Response> {
    if(!req.body?.organisation || !req.body?.user) {
      throw new APIError(400, 'Bad request');
    }

    try {
      let staff = null;
      let organisation = null;
      
      await TypeORMService.getInstance().getDataSource().transaction(
        async (transactionalEntityManager) => {
          const userGroup = await transactionalEntityManager.getRepository(Group).findOne({
            where: {
              'name': EXISTING_GROUPS.USER
            }
          });
          
          const user = await transactionalEntityManager.getRepository(User).create([{ ...req.body.user, group: userGroup.id}]);

          organisation = await transactionalEntityManager.getRepository(Organisation).save(req.body.organisation);
          
          staff = await transactionalEntityManager.getRepository(Staff).save({ organisation: organisation.id , user: user[0]});
        }
      );
      
      return res.send({organisation, staff});
    } catch(err) {
      console.error(err);
      throw new APIError(400, 'Bad request');
    }
  }

}
