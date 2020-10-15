import { RESTController } from '../libs/classes/RESTController';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { MembershipPlan, PlanType } from '../models/MembershipPlan';

export class MembershipPlanCtrl extends RESTController<MembershipPlan> {
  constructor() {
    super(getRepository(MembershipPlan));
  }

  public getAllTypes = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return res.status(201).send(Object.values(PlanType));
  };
}