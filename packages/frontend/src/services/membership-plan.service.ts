import { APIResource, GET } from './api.service';
class APIMembershipPlan extends APIResource {
  constructor() {
    super('membership-plans');
  }
  getAllTypes() {
    return GET('membership-plans/types');
  }
}

export const membershipPlanService = new APIMembershipPlan();
