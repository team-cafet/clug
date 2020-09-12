import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository, LessThanOrEqual } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }
  public getNotPaid(): Promise<Membership[]> {
    const today: Date = new Date();
    return this.repository.find({
      relations: ['paymentRequest', 'paymentRequest.Payment'],
    });
  }
  public async businessValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const data: Membership = req.body;

    const validationResult = await Membership.validate(data);

    if (validationResult) {
      return res.status(validationResult.status).send(validationResult.msg);
    }

    next();
  }

}
