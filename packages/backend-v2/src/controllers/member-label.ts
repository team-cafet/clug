import { RESTController } from '../libs/classes/RESTController';
import { MemberLabel } from '../models/MemberLabel';
import { getRepository } from 'typeorm';

export class MemberLabelCtrl extends RESTController<MemberLabel> {

  constructor(){    
    super(getRepository(MemberLabel));
  }
}