import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository, LessThanOrEqual } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as ControllerUtils from '../util/controller-utils';
import { EXISTING_GROUPS } from '../config/auth';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }

  /**
   * Custom getAll that return all membership that belongs to the user organisation
   * or all if the user is admin
   * @param req
   * @param res
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.user.group === EXISTING_GROUPS.ADMIN) {
      return res.send(await this.findAll());
    }

    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    const requestResult = await this.repository
      .createQueryBuilder('membership')
      .innerJoin('membership.member', 'member')
      .where('member.organisationId = :orgId', { orgId: currentOrg.id })
      .getMany();

    return res.send(requestResult);
  };

  /**
   * Custom getOne that return the membership with the id that belongs to
   * the user organisationor all if the user is admin
   * @param req
   * @param res
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === EXISTING_GROUPS.ADMIN) {
      return res.send(await this.findOneByID(id));
    }

    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    const requestResult = await this.repository
      .createQueryBuilder('membership')
      .innerJoin('membership.member', 'member')
      .where('member.organisationId = :orgId', { orgId: currentOrg.id })
      .andWhere('membership.id = :id', { id: id })
      .getOne();

    return res.send(requestResult);
  };

  /**
   * Will get all the membership that are not paid
   * @param req
   * @param res
   */
  public getNotPaid = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const today: Date = new Date();

    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    const membershipRequest = this.repository
      .createQueryBuilder('membership')
      .innerJoinAndSelect('membership.member', 'member')
      .innerJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('membership.paymentRequest', 'paymentRequest')
      .leftJoinAndSelect('paymentRequest.payment', 'paymentRequestPayment') 
      .innerJoinAndSelect('membership.plan', 'plan')
      .where('membership.endDate <= :today', {
        today: today.toDateString()
      });

    if (req.user.user.group !== EXISTING_GROUPS.ADMIN) {
      membershipRequest.andWhere('member.organisationId = :orgId', {
        orgId: currentOrg.id
      });
    }

    const memberships = await membershipRequest.getMany();
    
    const withoutPayment = memberships
      // will get only not paid payment
      .filter((membership) => !membership.paymentRequest?.payment)
      // will remove all password from user
      .map((membership) => {
        delete membership.member.user.password;
        return membership;
      });

    return res.send(withoutPayment);
  };

  /**
   * Will terminate the membership and remove linked payment request
   * @param req
   * @param res
   */
  public terminateMembership = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    const membership = await this.repository.findOne(id, {
      relations: ['paymentRequest', 'paymentRequest.payment']
    });

    // remove linked payment
    if (membership.paymentRequest && !membership.paymentRequest.payment) {
      await getRepository(PaymentRequest).delete(membership.paymentRequest.id);
    }

    // remove membership
    await this.repository.delete(id);

    return res.send(`Membership with id ${id} terminated`);
  };

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
