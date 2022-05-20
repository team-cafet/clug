import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { Request, Response, NextFunction } from 'express';
import { EXISTING_GROUPS } from '../config/auth';
import { APIError } from '../libs/classes/APIError';
import { Member } from '../models/Member';
import { MembershipPlan, PlanType } from '../models/MembershipPlan';
import { TypeORMService } from '../libs/services/TypeORMService';
import { Repository } from 'typeorm';
import { PaymentRequest } from '../models/PaymentRequest';
import { ControllerHelper } from '../libs/classes/helpers/ControllerHelper';

export class MembershipCtrl extends RESTController<Membership> {
  private membershipPlanRepository: Repository<MembershipPlan>;
  private paymentRequestRepository: Repository<PaymentRequest>;
  private memberRepository: Repository<Member>;

  constructor() {
    super(Membership);
    this.membershipPlanRepository = TypeORMService.getInstance().getRepository(MembershipPlan);
    this.paymentRequestRepository = TypeORMService.getInstance().getRepository(PaymentRequest);
    this.memberRepository = TypeORMService.getInstance().getRepository(Member);
  }

  /**
   * Custom getAll that return all membership that belongs to the user organisation
   * or all if the user is admin
   * @param req
   * @param res
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    const membershipsRequest = await this.repository
      .createQueryBuilder('membership')
      .innerJoinAndSelect('membership.member', 'member')
      .innerJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('membership.paymentRequest', 'paymentRequest')
      .leftJoinAndSelect('paymentRequest.payment', 'paymentRequestPayment')
      .leftJoinAndSelect('member.organisation', 'organisation')
      .innerJoinAndSelect('membership.plan', 'plan');

    if (req.user.user.group !== EXISTING_GROUPS.ADMIN) {
      const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(
        req
      );
      membershipsRequest.andWhere('member.organisation.id = :orgId', {
        orgId: currentOrg.id,
      });

    }
    const memberships = await membershipsRequest.getMany();

    return res.send(memberships);
  };

  /**
   * Custom getOne that return the membership with the id that belongs to
   * the user organisationor all if the user is admin
   * @param req
   * @param res
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    const membership = await this.repository.findOne({
      where: {id},
      relations: ['paymentRequest', 'paymentRequest.payment', 'member'],
    });

    if (!membership) {
      throw new APIError(404, 'not found');
    }

    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(
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

  public postOne = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.plan) return res.sendStatus(400);

    const membershipPlan = await this.membershipPlanRepository.findOne({ where: {id: req.body.plan}});

    if (!membershipPlan) return res.sendStatus(404);

    let numberOfDayToAddToStartDate = 0;

    switch (membershipPlan.type) {
      case PlanType.annual:
        numberOfDayToAddToStartDate = 365;
        break;

      case PlanType.biannual:
        numberOfDayToAddToStartDate = Math.round(365 / 2);
        break;

      case PlanType.monthly:
        numberOfDayToAddToStartDate = Math.round(30);
        break;

      case PlanType.quarterly:
        numberOfDayToAddToStartDate = Math.round(365 / 4);
        break;

      case PlanType.weekly:
        numberOfDayToAddToStartDate = Math.round(365 / 52);
        break;

      default:
        return res.sendStatus(404);
    }

    if (!req.body.startDate) return res.sendStatus(400);

    const endDate = new Date(req.body.startDate);
    endDate.setDate(endDate.getDate() + numberOfDayToAddToStartDate);

    req.body.endDate = endDate;

    return this.post(req, res);
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
    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(
      req
    );

    const membershipRequest = this.repository
      .createQueryBuilder('membership')
      .innerJoinAndSelect('membership.member', 'member')
      .innerJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('membership.paymentRequest', 'paymentRequest')
      .leftJoinAndSelect('paymentRequest.payment', 'paymentRequestPayment')
      .leftJoinAndSelect('member.organisation', 'organisation')
      .innerJoinAndSelect('membership.plan', 'plan');

    if (req.user.user.group !== EXISTING_GROUPS.ADMIN) {
      membershipRequest.andWhere('member.organisation.id = :orgId', {
        orgId: currentOrg.id,
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
    const membership = await this.repository.findOne({
      where: {id},
      relations: ['paymentRequest', 'paymentRequest.payment', 'member'],
    });

    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(
      req
    );

    if (
      req.user.user.group !== EXISTING_GROUPS.ADMIN &&
      membership.member.organisation.id !== currentOrg.id
    ) {
      throw new APIError(403, 'unauthorized');
    }

    // remove linked payment request
    if (membership.paymentRequest && !membership.paymentRequest.payment) {
      await this.paymentRequestRepository.delete(membership.paymentRequest.id);
    }

    // remove membership
    await this.repository.delete(id);

    return res.send(`Membership with id ${id} deleted`);
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public businessValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const data: Membership = req.body;

    if (!data.member?.id) {
      throw new APIError(400, 'Unknow member');
    }

    const [member, currentOrg] = await Promise.all([
      this.memberRepository.findOne({
        where: {id: data.member.id}
      }),
      ControllerHelper.getCurrentOrgFromUserInRequest(req),
    ]);

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
  };
}
