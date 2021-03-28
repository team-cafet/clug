import { Staff } from '../../models/Staff';
import { IFactory } from '../../libs/interfaces/IFactory';
import { UserFactory } from './UserFactory';
import { Group } from '@ClugBackend/models/Group';
import { Organisation } from '@ClugBackend/models/Organisation';

export class StaffFactory implements IFactory<Staff> {

    constructor(private userGroup: Group, private existingOrganisations: Organisation[]){}

    private getRandomOrganisation(){
        return this.existingOrganisations[Math.floor(Math.random() * this.existingOrganisations.length)];
    }

    define(): Staff {
        const userFactory = new UserFactory(this.userGroup);

        const staff = new Staff();
        staff.user = userFactory.define();
        staff.organisation = this.getRandomOrganisation();
        return staff;
    }

}