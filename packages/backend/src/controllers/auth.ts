import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import {
  JWT_SECRET,
  TOKEN_EXPIRE_IN,
  GROUP_PERMISSIONS,
  EXISTING_GROUPS
} from '../config/auth';
import { APIError } from '../libs/classes/APIError';

interface ITokenContent {
  user: {
    id: number;
    username: string;
    group: string;
  };
  permissions: string | string[];
}

/**
 * Following inteface must be the same as IUserInfo in backend
 */
interface IUserInfo {
  id: number;
  username: string;
  organisation: {
    id: number;
  } | null;
  group: {
    id: number;
  };
}

export class AuthCtrl {
  private userRepository = getRepository(User);

  // constructor() {}

  public async validatePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async getToken(
    password: string,
    hash: string,
    tokenContent: ITokenContent
  ): Promise<string> {
    if (!(await this.validatePassword(password, hash))) {
      throw new APIError(403, 'Invalid password');
    }

    if (!JWT_SECRET) {
      throw new APIError(500, 'No secret defined...');
    }

    return new Promise((resolve, reject) =>
      jwt.sign(
        {
          ...tokenContent
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRE_IN, algorithm: 'HS256' },
        (err: jwt.JsonWebTokenError, token: string) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      )
    );
  }

  private getGroupPermission(grpName: string): string | string[] {
    switch (grpName) {
      case EXISTING_GROUPS.ADMIN:
        return GROUP_PERMISSIONS.admin;
      case EXISTING_GROUPS.MANAGER:
        return GROUP_PERMISSIONS.manager;
      case EXISTING_GROUPS.USER:
        return GROUP_PERMISSIONS.user;
      default:
        throw new APIError(403, 'This group has no permission set');
    }
  }

  public async login(
    username: string,
    password: string
  ): Promise<{ user: IUserInfo; token: string }> {
    
    const user = await this.userRepository.findOne(
      { username },
      {
        select: ['password', 'id', 'group'],
        join: {
          alias: 'user',
          innerJoinAndSelect: {
            group: 'user.group'
          }
        }
      }
    );

    if (!user)
      throw new APIError(403, `No user found for username ${username}`);
    if (!user.group) throw new APIError(403, 'This user has no group');

    const organisation = await user.getUserOrganisation();
    const permissions = this.getGroupPermission(user.group.name);
    const token = await this.getToken(password, user.password, {
      user: { username: user.username, group: user.group.name, id: user.id },
      permissions
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        organisation: !organisation ? null : { id: organisation.id },
        group: { id: user.group.id }
      },
      token
    };
  }
}
