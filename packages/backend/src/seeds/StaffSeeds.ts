import { EXISTING_GROUPS } from '@ClugBackend/config/auth';
import { Factory } from '@ClugBackend/libs/classes/Factory';
import { ISeeds } from '@ClugBackend/libs/interfaces/ISeeds';
import { Group } from '@ClugBackend/models/Group';
import { getRepository } from 'typeorm';
import { StaffFactory } from './factory/StaffFactory';

export class StaffSeeds implements ISeeds {
  private async getStaffUserGroup() {
    return getRepository(Group).findOneOrFail(EXISTING_GROUPS.MANAGER);
  }

  async run(): Promise<void> {
    const staffUserGroup = await this.getStaffUserGroup();

    const staffFactory = new StaffFactory(staffUserGroup);

    const staffs = Factory.createMany(10, staffFactory);

    const userStaffForTesting = staffFactory.define();
    userStaffForTesting.user.password = '1234';
    userStaffForTesting.user.username = 'staff';
    staffs.push(userStaffForTesting);

    await Promise.all(staffs.map(async (staffUser) => await staffUser.save()));
  }
}
