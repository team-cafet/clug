import { RESTController } from '../libs/classes/RESTController';
import { Organisation } from '../models/Organisation';

export class OrganisationCtrl extends RESTController<Organisation> {

  constructor(){    
    super(Organisation);
  }
}
