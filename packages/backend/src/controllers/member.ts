import { Member } from '../models/Member';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
import { Request, Response } from 'express';
import { IRequestWithFile } from '../libs/interfaces/IRequestWithFile';
import { S3FileManager } from '../libs/classes/S3FileManager';
import { OrganisationCtrl } from './organisation';
import { checkFileTypeFromName } from '../util/file-utils';
import { OrganisationRESTController } from '../libs/classes/OrganisationRESTController';

export class MemberCtrl extends OrganisationRESTController<Member> {
  public S3_PICTURE_BUCKET = (): string => 'member-picture';
  public AUTHORIZED_IMAGE_EXTENSION = (): string[] => ['png', 'jpeg', 'jpg'];
  protected organisationCtrl = new OrganisationCtrl();
  protected s3FileManager: S3FileManager = new S3FileManager();

  constructor() {
    super(getRepository(Member));

    this.options = {
      findAllOptions: {
        relations: ['user'],
      },
      findOneOptions: {
        relations: [
          'user',
          'memberLabels',
          'club',
          'memberships',
          'memberships.plan',
        ],
      },
    };
  }

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

      if (!checkFileTypeFromName(filename, this.AUTHORIZED_IMAGE_EXTENSION())) {
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
  public getPicture = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // TODO: Maybe check if the user has the right to get picture
    const filename = req.params.filename;
    const file = await this.s3FileManager.getFromBucket(
      this.S3_PICTURE_BUCKET(),
      filename
    );
    const contentType = `image/${checkFileTypeFromName(
      filename,
      this.AUTHORIZED_IMAGE_EXTENSION()
    )}`;

    res.set('Content-Type', contentType);
    return res.send(file.Body);
  };

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

  public async updateMemberBalance(
    memberID: number,
    value: number
  ): Promise<Member> {
    let memberUpdated: Member;
    try {
      const member = await getRepository(Member).findOneOrFail(memberID);
      member.balance += value;
      memberUpdated = await getRepository(Member).save(member);
    } catch (error) {
      console.error('unable to update member balance');
    }
    return memberUpdated;
  }
}
