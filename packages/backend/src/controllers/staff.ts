import { RESTController } from '../libs/classes/RESTController';
import { Staff } from '../models/Staff';

export class StaffCtrl extends RESTController<Staff> {

  constructor(){    
    super(Staff);
  }
}
