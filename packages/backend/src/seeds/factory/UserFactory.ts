import * as faker from 'faker';
import { User, Sexe } from '../../models/User';
import { IFactory } from '../../libs/interfaces/IFactory';
import { Person } from '../../models/Person';

export class UserFactory implements IFactory<User> {

  constructor(private userGroup){}

  define(): User {
    const person = new Person();
    delete person.user;

    const user = new User();
    user.person = null;

    user.person = person;
  
        
    user.city = faker.address.city();
    user.country = faker.address.country();
    user.streetNumber = faker.datatype.number(99);
    user.street = faker.address.streetName();
    user.postalCode = faker.datatype.number({min: 1000, max: 9999, precision: 1});
        
    user.person.email = faker.internet.email();
    user.person.firstname = faker.name.firstName();
    user.person.lastname = faker.name.lastName();
    user.birthdate = faker.date.past();
    user.sexe = faker.random.arrayElement([Sexe.FEMALE, Sexe.MALE, Sexe['NON-BINARY']]);
    user.phone = faker.phone.phoneNumber('+## ## ### ## ##');

    user.password = faker.random.words(3);

    user.group = this.userGroup;

    return user;
  }

  defineAdmin(adminGroup): User {
    const admin = this.define();
    admin.username = 'admin';
    admin.person.email = 'admin@test.ch';
    admin.password = '1234';
    admin.group = adminGroup;

    return admin;
  }

}
