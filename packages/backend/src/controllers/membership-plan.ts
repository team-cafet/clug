import { Request, Response } from 'express';
import { MembershipPlan, PlanType } from '../models/MembershipPlan';
import { OrganisationRESTController } from '../libs/classes/OrganisationRESTController';

export class MembershipPlanCtrl extends OrganisationRESTController<MembershipPlan> {
  constructor() {
    super(MembershipPlan);
  }

  public getAllTypes = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // Return the list of type's names. We probably have to do a refactoring about
    // membershipplan's types like have a specific table in the db.
    return res
      .status(201)
      .send(Object.values(PlanType).filter((type) => typeof type === 'string'));
  };

}
