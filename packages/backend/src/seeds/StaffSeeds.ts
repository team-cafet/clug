import { EXISTING_GROUPS } from '../config/auth';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { Group } from '../models/Group';
import { StaffFactory } from './factory/StaffFactory';
import { Organisation } from '../models/Organisation';
import { TypeORMService } from '../libs/services/TypeORMService';

export class StaffSeeds implements ISeeds {
  private groupRepository = TypeORMService.getInstance().getRepository(Group);
  private organisationRepository = TypeORMService.getInstance().getRepository(Organisation);

  private async getStaffUserGroup() {
    return this.groupRepository.findOneOrFail({where: {name:EXISTING_GROUPS.MANAGER}});
  }

  private async getFiveFirstOrganisation(): Promise<Organisation[]>{
    return await this.organisationRepository.find({take: 5});
  }

  async run(): Promise<void> {
    const staffUserGroup = await this.getStaffUserGroup();
    const organisations = await this.getFiveFirstOrganisation();

    const staffFactory = new StaffFactory(staffUserGroup, organisations);

    const staffs = Factory.createMany(10, staffFactory);

    const userStaffForTesting = staffFactory.define();
    userStaffForTesting.user.password = '1234';
    userStaffForTesting.user.username = 'staff';
    userStaffForTesting.user.email = 'staff@test.ch';
    staffs.push(userStaffForTesting);

    await TypeORMService.getInstance().getDataSource().manager.save(staffs);
  }
}
