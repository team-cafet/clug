import { ISeeds } from '../libs/interfaces/ISeeds';
import { getConnection } from 'typeorm';
import { OrganisationSeeds } from './OrganisationSeeds';
import { StaffSeeds } from './StaffSeeds';
import { UserSeeds } from './UserSeeds';
import { ClubSeeds } from './ClubSeeds';
import { MembershipPlanSeeds } from './MembershipPlanSeeds';
import { MemberSeeds } from './MemberSeeds';
import { TagSeeds } from './TagSeeds';

export class DatabaseSeeds implements ISeeds
{
  async run(): Promise<void> {
    console.log('-----------Cleaning Database');
    await this.clearDatabase();

    console.log('-----------Seeding database');
    await (new OrganisationSeeds()).run();
    await (new UserSeeds()).run();
    await (new StaffSeeds()).run();
    await (new ClubSeeds()).run();
    await (new MembershipPlanSeeds).run();
    await (new TagSeeds).run();
    await (new MemberSeeds).run();

    console.log('-----------Seeding ended witout errors');
  }

  private async clearDatabase() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const truncatedEntities = entities.map(entity => `public."${entity.tableName}"`);
    await connection.query(`TRUNCATE ${truncatedEntities.join(',')} CASCADE`); 
  }

}
