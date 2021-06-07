import { EXISTING_GROUPS } from '../config/auth';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { Group } from '../models/Group';
import { getConnection, getRepository } from 'typeorm';
import { Organisation } from '../models/Organisation';
import { MemberFactory } from './factory/MemberFactory';
import { Club } from '../models/Club';
import { MembershipPlan } from '../models/MembershipPlan';
import { MemberLabel } from '../models/MemberLabel';

export class MemberSeeds implements ISeeds {
  private async getMemberUserGroup() {
    return getRepository(Group).findOneOrFail({ name: EXISTING_GROUPS.USER });
  }

  private async getFiveFirstOrganisation(): Promise<Organisation[]> {
    return await getRepository(Organisation).find({ take: 5 });
  }

  private async getAllClubFromOrganisations(organisations: Organisation[]): Promise<Club[]> {
    const organisationsIDs = organisations.map(org => org.id);
    const clubs = await getRepository(Club).find({relations:['organisation']});
    return clubs.filter(club => organisationsIDs.includes(club.organisation.id));
  }
  
  private async getAllMembershipPlanFromOrganisations(organisations): Promise<MembershipPlan[]> {
    const organisationsIDs = organisations.map(org => org.id);
    const plans = await getRepository(MembershipPlan).find({relations:['organisation']});
    return plans.filter(plan => organisationsIDs.includes(plan.organisation.id));
  }
  
  private async getAllTagsFromOrganisations(organisations): Promise<MemberLabel[]> {
    const organisationsIDs = organisations.map(org => org.id);
    const tags = await getRepository(MemberLabel).find({relations:['organisation']});
    return tags.filter(tag => organisationsIDs.includes(tag.organisation.id));
  }
  
  async run(): Promise<void> {
    const memberUserGroup = await this.getMemberUserGroup();
    const organisations = await this.getFiveFirstOrganisation();
    const clubs = await this.getAllClubFromOrganisations(organisations);
    const memberships = await this.getAllMembershipPlanFromOrganisations(organisations);
    const tags = await this.getAllTagsFromOrganisations(organisations);

    const memberFactory = new MemberFactory(
      memberUserGroup,
      organisations,
      clubs,
      memberships,
      tags
    );

    const members = Factory.createMany(process.env.SEEDS_NB_MEMBER ? Number.parseInt(process.env.SEEDS_NB_MEMBER) : 1000, memberFactory);

    await getConnection().manager.save(members);
  }
}
