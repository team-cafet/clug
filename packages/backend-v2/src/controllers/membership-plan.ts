import { RESTController } from '../libs/classes/RESTController';
import { getRepository } from 'typeorm';
import { MemberCtrl } from './member';
import { Member } from '../models/Member';
import { MembershipPlan } from '../models/MembershipPlan';

export class MembershipPlanCtrl extends RESTController<MembershipPlan> {
  constructor() {
    super(getRepository(MembershipPlan));
  }
}
