import { EXISTING_GROUPS } from '../config/auth';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { Group } from '../models/Group';
import { Organisation } from '../models/Organisation';
import { MemberFactory } from './factory/MemberFactory';
import { MembershipPlan } from '../models/MembershipPlan';
import { TypeORMService } from '../libs/services/TypeORMService';

export class MemberSeeds implements ISeeds {
  private groupRepository = TypeORMService.getInstance().getRepository(Group);
  private organisationRepository = TypeORMService.getInstance().getRepository(Organisation);
  private membershipPlanRepository = TypeORMService.getInstance().getRepository(MembershipPlan);


  private async getMemberUserGroup() {
    return this.groupRepository.findOneOrFail({ where: { name: EXISTING_GROUPS.USER }});
  }

  private async getFiveFirstOrganisation(): Promise<Organisation[]> {
    return await this.organisationRepository.find({ take: 5 });
  }

  private async getAllMembershipPlanFromOrganisations(organisations): Promise<MembershipPlan[]> {
    const organisationsIDs = organisations.map(org => org.id);
    const plans = await this.membershipPlanRepository.find({relations:['organisation']});
    return plans.filter(plan => organisationsIDs.includes(plan.organisation.id));
  }
  
  async run(): Promise<void> {
    const memberUserGroup = await this.getMemberUserGroup();
    const organisations = await this.getFiveFirstOrganisation();
    const memberships = await this.getAllMembershipPlanFromOrganisations(organisations);

    const memberFactory = new MemberFactory(
      memberUserGroup,
      organisations,
      memberships,
    );

    const members = Factory.createMany(process.env.SEEDS_NB_MEMBER ? Number.parseInt(process.env.SEEDS_NB_MEMBER) : 200, memberFactory);

    await TypeORMService.getInstance().getDataSource().manager.save(members);
  }
}
