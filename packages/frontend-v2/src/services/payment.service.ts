import { IMembership } from '../libs/interfaces/membership.interface';
import { IPayment } from '../libs/interfaces/payment.interface';
import { APIResource, POST } from './api.service';

class APIPayments extends APIResource {
  constructor() {
    super('payments');
  }
  createPaymentWithoutRequest(body: {
    payment: IPayment;
    memberShip: IMembership;
  }) {
    return POST('payments/payment-without-request', body);
  }
}

export const paymentService = new APIPayments();
