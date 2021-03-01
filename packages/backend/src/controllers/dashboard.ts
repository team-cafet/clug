import { Response, Request } from 'express';
import { Member } from '../models/Member';
import { User } from '../models/User';
import { getRepository } from 'typeorm';
import { MemberCtrl } from './member';

interface IGetAllStats {
  birthdays: Member[];
  negativeBalanceUsers: Member[];
  totalMembers: Member[];
}

export class DashboardCtrl {
  private async getAllUpcomingMemberBirthdayInOrg(
    orgID: number
  ): Promise<Member[]> {
    const NBR_MIN_DAY_TO_INCLUDE_MEMBER = 7;
    const memberRepo = getRepository(Member);

    return memberRepo
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
    const memberRepo = getRepository(Member);

    return memberRepo
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

    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(req.user.user.id);
    const currentOrg = await currentUser.getUserOrganisation();
    if (!currentOrg) {
      return res.send(allStats);
    }

    const memberCtrl = new MemberCtrl();
    allStats.totalMembers = await memberCtrl.findAll();

    allStats.birthdays = await this.getAllUpcomingMemberBirthdayInOrg(
      currentOrg.id
    );
    allStats.negativeBalanceUsers = await this.getAllMemberWithNegativeBalanceInOrg(
      currentOrg.id
    );

    return res.send(allStats);
  };
}
