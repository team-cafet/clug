import { MemberLabel } from '../models/MemberLabel';
import { getRepository } from 'typeorm';
import { OrganisationRESTController } from '../libs/classes/OrganisationRESTController';

export class MemberLabelCtrl extends OrganisationRESTController<MemberLabel> {
  constructor() {
    super(getRepository(MemberLabel));
  }
}
