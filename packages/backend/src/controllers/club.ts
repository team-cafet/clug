import { getRepository } from 'typeorm';
import { Club } from '../models/Club';
import { OrganisationRESTController } from '../libs/classes/OrganisationRESTController';

export class ClubCtrl extends OrganisationRESTController<Club> {
  constructor() {
    super(getRepository(Club));
  }

}
