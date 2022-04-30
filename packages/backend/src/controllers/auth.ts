import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { JWT_SECRET, TOKEN_EXPIRE_IN, EXISTING_GROUPS } from '../config/auth';
import { APIError } from '../libs/classes/APIError';
import { getGroupPermission } from '../libs/functions/auth';
import { getToken } from '../libs/functions/auth';

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

  public async login(
    username: string,
    password: string
  ): Promise<{ user: IUserInfo; token: string }> {
    const user = await this.userRepository.findOne({
      select: ['password', 'id', 'group'],
      relations: ['group'],
      where: [
        {
          username,
          group: { name: EXISTING_GROUPS.USER },
        },
        {
          username,
          group: { name: EXISTING_GROUPS.MANAGER },
        },
      ]
    });

    if (!user)
      throw new APIError(403, `No user found for username ${username}`);
    if (!user.group) throw new APIError(403, 'This user has no group');

    const organisation = await user.getUserOrganisation();
    const permissions = getGroupPermission(user.group.name);
    const token = await getToken(
      password,
      user.password,
      JWT_SECRET,
      TOKEN_EXPIRE_IN,
      {
        user: { username: user.username, group: user.group.name, id: user.id },
        permissions,
      }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        organisation: !organisation ? null : { id: organisation.id },
        group: { id: user.group.id },
      },
      token,
    };
  }
}
