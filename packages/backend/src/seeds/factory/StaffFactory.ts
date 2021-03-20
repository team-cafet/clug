import { Staff } from '../../models/Staff';
import { IFactory } from '../../libs/interfaces/IFactory';
import { UserFactory } from './UserFactory';

export class StaffFactory implements IFactory<Staff> {

    constructor(private userGroup){}

    define(): Staff {
        const userFactory = new UserFactory(this.userGroup);

        const staff = new Staff();
         
        staff.user = userFactory.define();

        return staff;
    }

}