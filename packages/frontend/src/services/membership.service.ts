import { APIResource, DELETE, GET } from './api.service';
class APIMembership extends APIResource {
  constructor() {
    super('memberships');
  }
  
  getNotPaid() {
    return GET('memberships/notPaid');
  }

  terminateMembership(id: number) {
    return this.delete(id);
  }

}

export const membershipService = new APIMembership();
