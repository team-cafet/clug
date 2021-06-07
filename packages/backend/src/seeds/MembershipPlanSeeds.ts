import { Organisation } from '../models/Organisation';
import { getRepository } from 'typeorm';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { MembershipPlanFactory } from './factory/MembershipPlanFactory';

export class MembershipPlanSeeds implements ISeeds {
  private async getFiveFirstOrganisation(): Promise<Organisation[]> {
    return await getRepository(Organisation).find({ take: 5 });
  }

  async run(): Promise<void> {
    const organisations = await this.getFiveFirstOrganisation();
    const membershipPlanFactory = new MembershipPlanFactory(organisations);

    const plans = Factory.createMany(Number.parseInt(process.env.SEEDS_NB_MEMBERSHIP) ?? 20, membershipPlanFactory);

    await Promise.all(plans.map(async (plan) => plan.save()));
  }
}
