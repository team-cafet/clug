import * as faker from 'faker';
import { IFactory } from '@ClugBackend/libs/interfaces/IFactory';
import { Organisation } from '@ClugBackend/models/Organisation';

export class OrganisationFactory implements IFactory<Organisation> {
  define(): Organisation {
    const organisation = new Organisation();
    organisation.name = faker.company.companyName();
    return organisation;
  }
}
