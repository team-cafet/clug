import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GROUP_PERMISSIONS } from '../../config/auth';
import { EXISTING_GROUPS } from '../../config/auth';
import { APIError } from '../classes/APIError';
import { ITokenContent } from '../interfaces/auth/ITokenContent';

export async function validatePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getToken(
  password: string,
  hash: string,
  secret: string,
  tokenExpiration: string | number,
  tokenContent: ITokenContent
): Promise<string> {
  if (!(await validatePassword(password, hash))) {
    throw new APIError(403, 'Invalid password');
  }

  if (!secret) {
    throw new APIError(500, 'No secret defined...');
  }

  return new Promise((resolve, reject) =>
    jwt.sign(
      {
        ...tokenContent
      },
      secret,
      { expiresIn: tokenExpiration, algorithm: 'HS256' },
      (err: jwt.JsonWebTokenError, token: string) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    )
  );
}

export function getGroupPermission(grpName: string): string | string[] {
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
