import { RESTController } from '../libs/classes/RESTController';
import { PaymentRequest } from '../models/PaymentRequest';
import { getRepository } from 'typeorm';

export class PaymentRequestCtrl extends RESTController<PaymentRequest> {

  constructor(){    
    super(getRepository(PaymentRequest));
  }
}
