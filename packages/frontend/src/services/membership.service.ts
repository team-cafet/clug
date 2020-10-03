import { APIResource, GET } from './api.service';
class APIMembership extends APIResource {
  constructor() {
    super('memberships');
  }
  getNotPaid() {
    return GET('memberships/notPaid');
  }
}

export const membershipService = new APIMembership();
