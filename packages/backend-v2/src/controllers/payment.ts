import { RESTController } from '../libs/classes/RESTController';
import { Payment } from '../models/Payment';
import { getRepository } from 'typeorm';

export class PaymentCtrl extends RESTController<Payment> {

  constructor(){    
    super(getRepository(Payment));
  }
}