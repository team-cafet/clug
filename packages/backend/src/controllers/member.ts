import { Request, Response } from 'express';
import sharp from 'sharp';
import { getRepository } from 'typeorm';
import { Member } from '../models/Member';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
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
        relations: ['user', 'memberships', 'memberships.paymentRequest', 'memberships.paymentRequest.payment'],
      },
      findOneOptions: {
        relations: [
          'user',
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
        const compressedFile = await sharp(req.file.buffer)
          .resize(500, 500, {
            kernel: sharp.kernel.nearest,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0.5 }
          })
          .png({compressionLevel: 7})
          .toBuffer();

        await this.s3FileManager.uploadToBucket(
          this.S3_PICTURE_BUCKET(),
          filename,
          compressedFile,
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
