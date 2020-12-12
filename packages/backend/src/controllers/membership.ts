import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as ControllerUtils from '../util/controller-utils';
import { EXISTING_GROUPS } from '../config/auth';
import { APIError } from '../libs/classes/APIError';
import { Member } from '../models/Member';

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

    const membership = await this.repository.findOne(id, {
      relations: ['paymentRequest', 'paymentRequest.payment', 'member']
    });

    if (!membership) {
      throw new APIError(404, 'not found');
    }

    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    if (
      req.user.user.group !== EXISTING_GROUPS.ADMIN &&
      membership.member.organisation.id !== currentOrg.id
    ) {
      throw new APIError(403, 'unauthorized');
    }

    return res.send(membership);
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
      .filter((membership) => !membership.paymentRequest?.payment);

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
      relations: ['paymentRequest', 'paymentRequest.payment', 'member']
    });

    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    if (
      req.user.user.group !== EXISTING_GROUPS.ADMIN &&
      membership.member.organisation.id !== currentOrg.id
    ) {
      throw new APIError(403, 'unauthorized');
    }

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
  ): Promise<void> {
    const data: Membership = req.body;

    if (!data.member?.id) {
      throw new APIError(400, 'Unknow member');
    }

    const [member, currentOrg] = await Promise.all([
      getRepository(Member).findOne(data.member.id, {
        relations: []
      }),
      ControllerUtils.getCurrentOrgFromUserInRequest(req)
    ]);

    // Permission for orgnanisation check
    if (
      req.user.user.group !== EXISTING_GROUPS.ADMIN &&
      member.organisation.id !== currentOrg.id
    ) {
      throw new APIError(403, 'Unauthorized');
    }

    const validationResult = await Membership.validate(data);

    if (validationResult) {
      throw validationResult;
    }

    next();
  }

}
