import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository, IsNull, LessThanOrEqual } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }
  public async getNotPaid(req: Request, res: Response): Promise<Response> {
    // TODO: not return password damm 
    const today: Date = new Date();
    return res.send(
      await getRepository(Membership).find({
        relations: [
          'paymentRequest',
          'paymentRequest.payment',
          'member',
          'member.user',
          'plan'
        ],
        where: {
          endDate: LessThanOrEqual(today.toDateString())
        }
      })
    );
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
