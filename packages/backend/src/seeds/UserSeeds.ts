import { User } from '../models/User';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { UserFactory } from './factory/UserFactory';
import { EXISTING_GROUPS } from '../config/auth';
import { getRepository } from 'typeorm';
import { Group } from '../models/Group';
import { Factory } from '@ClugBackend/libs/classes/Factory';

export class UserSeeds implements ISeeds {

    private ADMIN_GROUP;
    private MANAGER_GROUP;
    private USER_GROUP;

    constructor(){
        this.createUserGroup().then(groups => {
            this.ADMIN_GROUP = groups[0];
            this.MANAGER_GROUP = groups[1];
            this.USER_GROUP = groups[2];
        });
    }

    private async createUserGroup(){
        return await getRepository(Group).save([
            { name: EXISTING_GROUPS.ADMIN },
            { name: EXISTING_GROUPS.MANAGER },
            { name: EXISTING_GROUPS.USER }
        ]);
    }

    async run(): Promise<void> {
        const userFactory = new UserFactory(this.USER_GROUP);
        const users: User[] = Factory.createMany(10, userFactory);
        users.push(userFactory.defineAdmin(this.ADMIN_GROUP));

        await Promise.all(users.map( async user => await user.save()));
    }
    
}