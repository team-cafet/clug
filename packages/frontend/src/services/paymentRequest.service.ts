import { IMembership } from '../libs/interfaces/membership.interface';
import { IPaymentRequest } from '../libs/interfaces/paymentRequest.interface';
import { APIResource, POST } from './api.service';

class APIPaymentRequest extends APIResource {
  constructor() {
    super('payment-requests');
  }
  createPaymenRequestAndUpdateMembership(body: {
    paymentRequest: IPaymentRequest;
    membership: IMembership;
  }) {
    return POST('payment-requests/payment-request-membership', body);
  }
}

export const paymentRequestService = new APIPaymentRequest();
