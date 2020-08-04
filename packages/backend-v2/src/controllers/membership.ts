import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository } from 'typeorm';

export class MembershipCtrl extends RESTController<Membership> {

  constructor(){    
    super(getRepository(Membership));
  }
}