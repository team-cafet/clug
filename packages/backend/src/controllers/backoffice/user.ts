import { getRepository } from 'typeorm';
import { RESTController } from '../../libs/classes/RESTController';
import { User } from '../../models/User';

export class UserController extends RESTController<User> {
  constructor() {
    super(getRepository(User));
  }
}
