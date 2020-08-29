import { RESTController } from '../libs/classes/RESTController';
import { Member } from '../models/Member';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
import { Request, Response } from 'express';

export class MemberCtrl extends RESTController<Member> {
  constructor() {
    super(getRepository(Member));
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.user.group === 'admin') {
      return res.send(await this.findAll());
    }
    const userRepo = getRepository(User);
    const currentUser = await userRepo.findOne(req.user.user.id);

    const currentOrg = await currentUser.getUserOrganisation();

    return res.send(
      await this.findAll({
        relations: ['user'],
        where: { organisation: currentOrg.id },
      })
    );
  };

  public async isUserCanCreateMember(
    memberBody: Member,
    userID: number
  ): Promise<boolean> {
    const user = await getRepository(User).findOneOrFail(userID);
    const member = this.repository.create(memberBody);
    if (!user) {
      return false;
    }

    if (
      user?.group?.name === EXISTING_GROUPS.ADMIN ||
      user?.group?.name === EXISTING_GROUPS.MANAGER
    ) {
      return true;
    }

    const staff = await getRepository(Staff).findOneOrFail({ user });

    if (staff && staff?.organisation?.id === member?.organisation?.id) {
      return true;
    }

    return false;
  }

  public async isUserCanUpdateMember(
    memberID: number,
    userID: number
  ): Promise<boolean> {
    const user = await getRepository(User).findOneOrFail(userID);
    const member = await this.repository.findOneOrFail(memberID);

    if (
      user?.group?.name === EXISTING_GROUPS.ADMIN ||
      user?.group?.name === EXISTING_GROUPS.MANAGER
    ) {
      return true;
    }

    const staff = await getRepository(Staff).findOne({ user });

    if (staff && staff?.organisation?.id === member?.organisation?.id) {
      return true;
    }

    if (member?.user?.id === userID) {
      return true;
    }

    return false;
  }
}
