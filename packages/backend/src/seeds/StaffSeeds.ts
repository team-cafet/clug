import { EXISTING_GROUPS } from '../config/auth';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { Group } from '../models/Group';
import { getRepository } from 'typeorm';
import { StaffFactory } from './factory/StaffFactory';
import { Organisation } from '../models/Organisation';

export class StaffSeeds implements ISeeds {
  private async getStaffUserGroup() {
    return getRepository(Group).findOneOrFail({name:EXISTING_GROUPS.MANAGER});
  }

  private async getFiveFirstOrganisation(): Promise<Organisation[]>{
    return await getRepository(Organisation).find({take: 5});
  }

  async run(): Promise<void> {
    const staffUserGroup = await this.getStaffUserGroup();
    const organisations = await this.getFiveFirstOrganisation();

    const staffFactory = new StaffFactory(staffUserGroup, organisations);

    const staffs = Factory.createMany(10, staffFactory);

    const userStaffForTesting = staffFactory.define();
    userStaffForTesting.user.password = '1234';
    userStaffForTesting.user.username = 'staff';
    staffs.push(userStaffForTesting);

    await Promise.all(staffs.map(async (staffUser) => await staffUser.save()));
  }
}
