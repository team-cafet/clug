import { ISeeds } from '../libs/interfaces/ISeeds';
import { UserFactory } from './factory/UserFactory';
import { EXISTING_GROUPS } from '../config/auth';
import { Group } from '../models/Group';
import { TypeORMService } from '../libs/services/TypeORMService';

export class UserSeeds implements ISeeds {
  private ADMIN_GROUP;
  private MANAGER_GROUP;
  private USER_GROUP;

  private async createUserGroup() {
    return await TypeORMService.getInstance().getRepository(Group).save([
      { name: EXISTING_GROUPS.ADMIN },
      { name: EXISTING_GROUPS.MANAGER },
      { name: EXISTING_GROUPS.USER },
    ]);
  }

  async run(): Promise<void> {
    const groups = await this.createUserGroup();
    this.ADMIN_GROUP = groups[0];
    this.MANAGER_GROUP = groups[1];
    this.USER_GROUP = groups[2];

    const userFactory = new UserFactory(this.USER_GROUP);
    const users = [userFactory.defineAdmin(this.ADMIN_GROUP)];
    await TypeORMService.getInstance().getDataSource().manager.save(users);
  }
}
