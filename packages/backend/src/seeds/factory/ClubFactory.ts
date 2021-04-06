import * as faker from 'faker';
import { Club } from '../../models/Club';
import { IFactory } from '../../libs/interfaces/IFactory';
import { Organisation } from '../../models/Organisation';

export class ClubFactory implements IFactory<Club> {
  constructor(
    private existingOrganisations: Organisation[]
  ) {}

  private getRandomOrganisation() {
    return this.existingOrganisations[
      Math.floor(Math.random() * this.existingOrganisations.length)
    ];
  }

  define(): Club {
    const club = new Club();
    club.name = faker.company.companyName();
    club.description = faker.lorem.paragraph(1);
    club.organisation = this.getRandomOrganisation();
    return club;
  }
}
