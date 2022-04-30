import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import { ControllerHelper } from '../libs/classes/helpers/ControllerHelper';
import { IGetAllStats } from '../libs/interfaces/dashboard/IGetAllStats';
import { TypeORMService } from '../libs/services/TypeORMService';
import { Member } from '../models/Member';
import { MemberCtrl } from './member';

export class DashboardCtrl {
  protected memberRepository: Repository<Member>;

  constructor() {
    this.memberRepository = TypeORMService.getInstance().getRepository(Member);
  }

  private async getAllUpcomingMemberBirthdayInOrg(
    orgID: number
  ): Promise<Member[]> {
    const NBR_MIN_DAY_TO_INCLUDE_MEMBER = 7;

    return this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.organisation', 'organisation')
      .where('organisation.id = :id', { id: orgID })
      .andWhere(
        "DATE_PART('doy', user.birthdate) >= DATE_PART('doy', CURRENT_DATE)"
      )
      .andWhere(
        `DATE_PART(\'doy\', user.birthdate) <= DATE_PART('doy', CURRENT_DATE + INTERVAL '${NBR_MIN_DAY_TO_INCLUDE_MEMBER} day')`
      )
      .getMany();
  }

  private async getAllMemberWithNegativeBalanceInOrg(
    orgID: number
  ): Promise<Member[]> {
    return this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.organisation', 'organisation')
      .where('organisation.id = :id', { id: orgID })
      .andWhere('member.balance < 0')
      .getMany();
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    const allStats: IGetAllStats = {
      birthdays: [],
      negativeBalanceUsers: [],
      totalMembers: []
    };

    const currentOrg = await ControllerHelper.getCurrentOrgFromUserInRequest(req);
    if (!currentOrg) {
      return res.send(allStats);
    }

    const memberCtrl = new MemberCtrl();
    allStats.totalMembers = await memberCtrl.findAll({where: { organisation: currentOrg.id }});

    allStats.birthdays = await this.getAllUpcomingMemberBirthdayInOrg(
      currentOrg.id
    );
    allStats.negativeBalanceUsers = await this.getAllMemberWithNegativeBalanceInOrg(
      currentOrg.id
    );

    return res.send(allStats);
  };
}
