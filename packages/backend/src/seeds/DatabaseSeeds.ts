import { ISeeds } from '../libs/interfaces/ISeeds';
import { getConnection } from 'typeorm';
import { OrganisationSeeds } from './OrganisationSeeds';
import { StaffSeeds } from './StaffSeeds';
import { UserSeeds } from './UserSeeds';

export class DatabaseSeeds implements ISeeds
{
    async run(): Promise<void> {
        console.log('-----------Cleaning Database');
        this.clearDatabase();

        console.log('-----------Seeding database');
        await (new OrganisationSeeds()).run();
        await (new UserSeeds()).run();
        await (new StaffSeeds()).run();
    }

    private async clearDatabase() {
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        entities.forEach(async (entity) => {
            const repository = connection.getRepository(entity.name);
            await repository.query(`DELETE FROM public.${entity.tableName}`);
        });
    }

}