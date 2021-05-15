import * as faker from 'faker';
import { IFactory } from '../../libs/interfaces/IFactory';
import { Organisation } from '../../models/Organisation';
import { MemberLabel } from '../../models/MemberLabel';

export class TagFactory implements IFactory<MemberLabel> {
  constructor(
    private existingOrganisations: Organisation[]
  ) {}

  private getRandomOrganisation() {
    return faker.random.arrayElement(this.existingOrganisations); 
  }

  define(): MemberLabel {
    const tag = new MemberLabel();
    tag.name = faker.internet.color(); 
    tag.organisation = this.getRandomOrganisation();
    return tag;
  }
}
