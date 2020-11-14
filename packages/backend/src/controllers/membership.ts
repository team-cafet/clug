import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository, LessThanOrEqual } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }

  /**
   * Will get all the membership that are not paid
   * @param req
   * @param res
   */
  public async getNotPaid(req: Request, res: Response): Promise<Response> {
    const today: Date = new Date();

    const memberships = await this.repository.find({
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
    });

    const withoutPayment = memberships
      // will get only not paid payment
      .filter((membership) => !membership.paymentRequest?.payment)
      // will remove all password from user
      .map((membership) => {
        delete membership.member.user.password;
        return membership;
      });

    return res.send(withoutPayment);
  }

  /**
   * Will terminate the membership and remove linked payment request
   * @param req
   * @param res
   */
  public async terminateMembership(
    req: Request,
    res: Response
  ): Promise<Response> {
    const id = Number.parseInt(req.params.id);
    const membership = await this.repository.findOne(id, {
      relations: ['paymentRequest', 'paymentRequest.payment']
    });

    // remove linked payment
    await getRepository(PaymentRequest).delete(membership.paymentRequest.id);

    // remove membership
    await this.repository.delete(id);

    return res.send('await this.remove(id)');
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
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
