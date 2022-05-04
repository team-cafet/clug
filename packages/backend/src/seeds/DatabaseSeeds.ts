import { ISeeds } from '../libs/interfaces/ISeeds';
import { OrganisationSeeds } from './OrganisationSeeds';
import { StaffSeeds } from './StaffSeeds';
import { UserSeeds } from './UserSeeds';
import { MembershipPlanSeeds } from './MembershipPlanSeeds';
import { MemberSeeds } from './MemberSeeds';
import { TypeORMService } from '../libs/services/TypeORMService';

export class DatabaseSeeds implements ISeeds {
  async run(withClear = true, withLog = true): Promise<void> {
    withLog && console.log('-----------Cleaning Database');
    
    if (withClear) {
      await this.clearDatabase();
    }

    withLog && console.log('-----------Seeding database');
    await new OrganisationSeeds().run();
    await new UserSeeds().run();
    await new StaffSeeds().run();
    await new MembershipPlanSeeds().run();
    await new MemberSeeds().run();

    withLog && console.log('-----------Seeding ended witout errors');
  }

  private async clearDatabase() {
    const connection = TypeORMService.getInstance().getDataSource();
    const entities = connection.entityMetadatas;

    const truncatedEntities = entities.map(
      (entity) => `public."${entity.tableName}"`
    );
    await connection.query(`TRUNCATE ${truncatedEntities.join(',')} CASCADE`);
  }
}
