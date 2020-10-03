import { RESTController } from '../libs/classes/RESTController';
import { Organisation } from '../models/Organisation';
import { getRepository } from 'typeorm';

export class OrganisationCtrl extends RESTController<Organisation> {

  constructor(){    
    super(getRepository(Organisation));
  }
}