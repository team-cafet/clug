import * as faker from 'faker';
import { IFactory } from '../../libs/interfaces/IFactory';
import { Organisation } from '../../models/Organisation';
import { MembershipPlan, PlanType } from '../../models/MembershipPlan';

export class MembershipPlanFactory implements IFactory<MembershipPlan> {
  constructor(
    private existingOrganisations: Organisation[]
  ) {}

  private getRandomOrganisation() {
    return faker.random.arrayElement(this.existingOrganisations);
  }

  private getRandomMembershipPlanType() {
    return faker.random.arrayElement([
      PlanType.annual,
      PlanType.biannual,
      PlanType.monthly,
      PlanType.quarterly,
      PlanType.weekly
    ]);
  }

  define(): MembershipPlan {
    const membershipPlan = new MembershipPlan();
    membershipPlan.price = faker.random.float({min:10, max: 999, precision: 2});
    membershipPlan.tacit = faker.random.boolean();
    membershipPlan.type = this.getRandomMembershipPlanType();
    membershipPlan.name = faker.lorem.paragraph(1);
    membershipPlan.organisation = this.getRandomOrganisation();
    return membershipPlan;
  }
}
