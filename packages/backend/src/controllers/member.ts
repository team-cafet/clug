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
import logger from '../util/logger';

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

  postPicture = async (
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

        return res.send({pictureURL: filename});
      } catch (err) {
        logger.debug(err);
        return res.sendStatus(500);
      }
    }
  }

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
}
