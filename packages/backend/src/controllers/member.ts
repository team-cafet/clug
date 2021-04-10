import { RESTController } from '../libs/classes/RESTController';
import { Member } from '../models/Member';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
import { Request, Response } from 'express';
import * as ControllerUtils from '../util/controller-utils';
import { IRequestWithFile } from '../libs/interfaces/IRequestWithFile';

export class MemberCtrl extends RESTController<Member> {
  constructor() {
    super(getRepository(Member));
  }

  /**
   * Custom getAll is needed here as we need to give only the member which
   * are related to the current user.
   * @param req 
   * @param res 
   */
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

  /**
   * Custom getOne is needed here as we need to give only member which are in the
   * user organisation and with more information like tag
   * @param req 
   * @param res 
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);

    if (req.user.user.group === EXISTING_GROUPS.ADMIN) {
      return res.send(await this.repository.findOneOrFail(id, {
        relations: ['user', 'memberLabels']
      }));
    }
    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(req);

    return res.send(await this.repository.findOneOrFail(id, {
      relations: ['user', 'memberLabels', 'club', 'memberships', 'memberships.plan'],
      where: { organisation: currentOrg.id }
    }));
  }

  /**
   * Check if the current user can create a member in the organisation
   * and if he has the right to do that
   * @param memberBody 
   * @param userID 
   */
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

  /**
   * Check if the current user can update a member in the organisation
   * and if he has the right to do that
   * @param memberID 
   * @param userID 
   */
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
  

  public updateMemberPicture = async (req: IRequestWithFile, res: Response) => {
    console.log(req.file);




    return res.status(200).send(req.file);
  }
}
