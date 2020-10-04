import { RESTController } from '../libs/classes/RESTController';
import { Staff } from '../models/Staff';
import { getRepository } from 'typeorm';

export class StaffCtrl extends RESTController<Staff> {

  constructor(){    
    super(getRepository(Staff));
  }
}