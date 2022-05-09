import { Request, Response } from 'express';
import sharp from 'sharp';
import { Member } from '../models/Member';
import { User } from '../models/User';
import { EXISTING_GROUPS } from '../config/auth';
import { Staff } from '../models/Staff';
import { IRequestWithFile } from '../libs/interfaces/IRequestWithFile';
import { S3FileManager } from '../libs/classes/S3FileManager';
import { OrganisationCtrl } from './organisation';
import { OrganisationRESTController } from '../libs/classes/OrganisationRESTController';
import logger from '../libs/functions/logger';
import { TypeORMService } from '../libs/services/TypeORMService';
import { Repository } from 'typeorm';

export class MemberCtrl extends OrganisationRESTController<Member> {
  public S3_PICTURE_BUCKET = (): string => 'member-pictures';
  public AUTHORIZED_IMAGE_EXTENSION = (): string[] => ['png', 'jpeg', 'jpg'];
  protected organisationCtrl = new OrganisationCtrl();
  protected s3FileManager: S3FileManager = new S3FileManager();
  protected userRepository: Repository<User>;
  protected staffRepository: Repository<Staff>;

  constructor() {
    super(Member);

    this.userRepository = TypeORMService.getInstance().getRepository(User);
    this.staffRepository = TypeORMService.getInstance().getRepository(Staff);

    this.options = {
      findAllOptions: {
        relations: ['user','user.person'],
      },
      findOneOptions: {
        relations: [
          'user',
          'memberships',
          'memberships.plan',
          'user.person'
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

      if (!S3FileManager.checkFileTypeFromName(filename, this.AUTHORIZED_IMAGE_EXTENSION())) {
        return res.sendStatus(400);
      }

      try {
        const compressedFile = await sharp(req.file.buffer)
          .resize(500, 500, {
            kernel: sharp.kernel.nearest,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0.5 },
          })
          .png({ compressionLevel: 7 })
          .toBuffer();

        await this.s3FileManager.uploadToBucket(
          this.S3_PICTURE_BUCKET(),
          filename,
          compressedFile,
          req.file.mimetype
        );

        return res.send({ pictureURL: filename });
      } catch (err) {
        logger.debug(err);
        return res.sendStatus(500);
      }
    }
  };

  public getPicture = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // TODO: Maybe check if the user has the right to get picture
    const filename = req.params.filename;
    const file = await this.s3FileManager.getFromBucket(
      this.S3_PICTURE_BUCKET(),
      filename,
      this.AUTHORIZED_IMAGE_EXTENSION()
    );
    
    res.set('Content-Type', file.contentType);
    return res.send(file.file);
  };

  public async isUserCanCreateMember(
    memberBody: Member,
    userID: number
  ): Promise<boolean> {
    const user = await this.userRepository.findOneOrFail({where: {id: userID}});
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

    const staff = await this.staffRepository.findOneOrFail({ where: {user: {id: user.id}} });

    if (staff && staff?.organisation?.id === member?.organisation?.id) {
      return true;
    }

    return false;
  }

  public async isUserCanUpdateMember(
    memberID: number,
    userID: number
  ): Promise<boolean> {
    const user = await this.userRepository.findOneOrFail({where:{id:userID}});
    const member = await this.repository.findOneOrFail({where: {id: memberID}});
    if (
      user?.group?.name === EXISTING_GROUPS.ADMIN ||
      user?.group?.name === EXISTING_GROUPS.MANAGER
    ) {
      return true;
    }

    const staff = await this.staffRepository.findOne({ where: {user: {id: user.id}} });

    if (staff && staff?.organisation?.id === member?.organisation?.id) {
      return true;
    }

    if (member?.user?.id === userID) {
      return true;
    }

    return false;
  }
}
