import { RESTController } from '../libs/classes/RESTController';
import { Member } from '../models/Member';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
import { Request, Response } from 'express';
import * as ControllerUtils from '../util/controller-utils';
import { IRequestWithFile } from '../libs/interfaces/IRequestWithFile';
import { S3FileManager } from '../libs/classes/S3FileManager';
import { OrganisationCtrl } from './organisation';
import { checkFileTypeFromName } from '../util/file-utils';

export class MemberCtrl extends RESTController<Member> {
  public S3_PICTURE_BUCKET = (): string => 'member-picture';
  public AUTHORIZED_IMAGE_EXTENSION = ():string[] => ['png', 'jpeg', 'jpg'];
  protected organisationCtrl = new OrganisationCtrl();
  protected s3FileManager: S3FileManager = new S3FileManager();

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
      return res.send(
        await this.repository.findOneOrFail(id, {
          relations: ['user', 'memberLabels'],
        })
      );
    }
    const currentOrg = await ControllerUtils.getCurrentOrgFromUserInRequest(
      req
    );

    return res.send(
      await this.repository.findOneOrFail(id, {
        relations: [
          'user',
          'memberLabels',
          'club',
          'memberships',
          'memberships.plan',
        ],
        where: { organisation: currentOrg.id },
      })
    );
  };

  /**
   *
   * @param req
   * @param res
   */
  public putWithPicture = async (
    req: IRequestWithFile,
    res: Response
  ): Promise<Response> => {
    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`;

      if(! checkFileTypeFromName(filename, this.AUTHORIZED_IMAGE_EXTENSION())){
        return res.sendStatus(400);
      }

      try {
        await this.s3FileManager.uploadToBucket(
          this.S3_PICTURE_BUCKET(),
          filename,
          req.file.buffer,
          req.file.mimetype
        );

        req.body.user = { ...req.body.user, pictureURL: filename };
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    }

    const id = Number.parseInt(req.params.id);

    if (
      !(await this.organisationCtrl.findOneByID(req.body?.organisation?.id))
    ) {
      res
        .status(404)
        .send(`No organisation found with id ${req.body?.organisation?.id}`);
      return;
    }

    if (!(await this.isUserCanUpdateMember(id, req.user.user.id))) {
      res.status(403).send('You are not authorized to update this member');
      return;
    }

    const member = new Member();
    member.user = req.body.user;
    member.note = req.body.note;
    member.organisation = req.body.organisation;
    member.memberLabels = req.body.memberLabels;
    member.club = req.body.club;

    const data = await this.update(id, member);
    return res.send(data);
  };

  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  public getPicture = async (req: Request, res: Response): Promise<Response> => {
    // TODO: Maybe check if the user has the right to get picture
    const filename = req.params.filename;
    const file = await this.s3FileManager.getFromBucket(this.S3_PICTURE_BUCKET(), filename);
    const contentType = `image/${checkFileTypeFromName(filename, this.AUTHORIZED_IMAGE_EXTENSION())}`;

    res.set('Content-Type', contentType);
    return res.send(file.Body);
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
}
