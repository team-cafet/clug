import { Factory } from '@ClugBackend/libs/classes/Factory';
import { ISeeds } from '@ClugBackend/libs/interfaces/ISeeds';
import { OrganisationFactory } from './factory/OrganisationFactory';

export class OrganisationSeeds implements ISeeds{
    async run(): Promise<void> {
        const organisationFactory = new OrganisationFactory();
        const organisations = Factory.createMany(10, organisationFactory);
        const testOrg = organisationFactory.define();
        testOrg.name = 'Clug';
        organisations.push(testOrg);

        await Promise.all(organisations.map(async org => org.save()));
    }
    
}