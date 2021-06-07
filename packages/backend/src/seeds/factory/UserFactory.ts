import * as faker from 'faker';
import { User, Sexe } from '../../models/User';
import { IFactory } from '../../libs/interfaces/IFactory';

export class UserFactory implements IFactory<User> {

  constructor(private userGroup){}

  define(): User {
    const user = new User();
        
    user.city = faker.address.city();
    user.country = faker.address.country();
    user.streetNumber = faker.datatype.number(99);
    user.street = faker.address.streetName();
    user.postalCode = faker.datatype.number({min: 1000, max: 9999, precision: 1});
        
    user.email = faker.internet.email();
    user.firstname = faker.name.firstName();
    user.lastname = faker.name.lastName();
    user.birthdate = faker.date.past();
    user.sexe = faker.random.arrayElement([Sexe.FEMALE, Sexe.MALE, Sexe['NON-BINARY']]);
    user.phone = faker.phone.phoneNumber('+## ## ### ## ##');

    user.password = faker.random.words(3);

    user.group = this.userGroup;

    return user;
  }

  defineAdmin(adminGroup): User {
    const admin = this.define();
    admin.email = 'admin@test.ch';
    admin.password = '1234';
    admin.group = adminGroup;

    return admin;
  }

}
