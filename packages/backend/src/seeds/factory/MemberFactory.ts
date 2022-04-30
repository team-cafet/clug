import * as faker from 'faker';
import { IFactory } from '../../libs/interfaces/IFactory';
import { UserFactory } from './UserFactory';
import { Group } from '../../models/Group';
import { Organisation } from '../../models/Organisation';
import { Member } from '../../models/Member';
import { MembershipPlan, PlanType } from '../../models/MembershipPlan';
import { Membership } from '../../models/Membership';
import { PaymentRequest } from '../../models/PaymentRequest';

export class MemberFactory implements IFactory<Member> {
  constructor(
    private userGroup: Group,
    private existingOrganisations: Organisation[],
    private existingMembershipPlans: MembershipPlan[],
  ) {}

  private getRandomOrganisation() {
    return faker.random.arrayElement(this.existingOrganisations);
  }

  // TODO: Extract this logic into the membership model
  private defineEndDateForMembership(startDate: Date, planType: PlanType) {
    let numberOfDayToAddToStartDate = 0;

    switch (planType) {
      case PlanType.annual:
        numberOfDayToAddToStartDate = 365;
        break;

      case PlanType.biannual:
        numberOfDayToAddToStartDate = Math.round(365 / 2);
        break;

      case PlanType.monthly:
        numberOfDayToAddToStartDate = Math.round(30);
        break;

      case PlanType.quarterly:
        numberOfDayToAddToStartDate = Math.round(365 / 4);
        break;

      case PlanType.weekly:
        numberOfDayToAddToStartDate = Math.round(365 / 52);
        break;

      default:
        break;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numberOfDayToAddToStartDate);
    return endDate;
  }

  private getRandomMembershipPlanFromOrganisation(organisation: Organisation) {
    const filteredMembershipPlan = this.existingMembershipPlans.filter(
      (membership) => membership.organisation.id === organisation.id
    );
    const plan = faker.random.arrayElement(filteredMembershipPlan);

    const newMembership = new Membership();
    newMembership.plan = plan;

    newMembership.startDate = faker.date.past(10);
    newMembership.endDate = this.defineEndDateForMembership(
      newMembership.startDate,
      plan.type
    );

    const newPaymentRequest = new PaymentRequest();
    newPaymentRequest.amount = plan.price;
    newPaymentRequest.date = newMembership.startDate;
    newPaymentRequest.description = `${plan.type} - ${plan.name}`;

    newMembership.paymentRequest = newPaymentRequest;

    return newMembership;
  }

  define(): Member {
    const userFactory = new UserFactory(this.userGroup);
    const organisation = this.getRandomOrganisation();

    const member = new Member();
    member.user = userFactory.define();
    member.organisation = organisation;

    if (faker.datatype.boolean()) {
      member.memberships = [
        this.getRandomMembershipPlanFromOrganisation(organisation),
      ];
      member.balance = -member.memberships[0].plan.price;
    } else {
      member.balance = 0;
    }

    return member;
  }
}
