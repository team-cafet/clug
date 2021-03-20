import { User } from '../models/User';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { UserFactory } from './factory/UserFactory';
import { EXISTING_GROUPS } from '../config/auth';
import { getRepository } from 'typeorm';
import { Group } from '../models/Group';

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

    async generate(number: number): Promise<User[]> {
        const userFactory = new UserFactory(this.USER_GROUP);
        const users: User[] = [];

        for (let i = 0; i < number; i++) {
           users.push(userFactory.define());
        }

        users.push(userFactory.defineAdmin(this.ADMIN_GROUP));

        return Promise.all(users.map( async user => await user.save()));
    }
    
}