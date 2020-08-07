import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository } from 'typeorm';
import { NextFunction } from 'express';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }

  public async businessValidation(req, res, next): Promise<void> {
    const data: Membership = (req.body as unknown) as Membership;

    //startDate < endDate
    const startDate: Date = new Date(data.startDate);
    const endDate: Date = new Date(data.endDate);
    if (startDate.getTime() >= endDate.getTime()){
      return res
        .status(400)
        .send('La date de début est après ou égale à la date de fin');
    }
      
    next();
  }
}
