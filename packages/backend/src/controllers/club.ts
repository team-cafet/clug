import { RESTController } from '../libs/classes/RESTController';
import { getRepository } from 'typeorm';
import { Club } from '../models/Club';

export class ClubCtrl extends RESTController<Club> {

  constructor(){    
    super(getRepository(Club));
  }
}