import {
  Post,
  ValidateBody,
  hashPassword,
  HttpResponseUnauthorized,
  verifyPassword,
  Context,
  HttpResponseOK,
  Config
} from '@foal/core';

import { User } from '../entities';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  type: 'object'
};


export class AuthController {
  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {    
    const USER_REPO = await getRepository(User)

    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await USER_REPO.save(user)    

    return this.generateLoginResponse(user);
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const USER_REPO = await getRepository(User)

    const user = await USER_REPO.findOne({
      email: ctx.request.body.email
    });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!(await verifyPassword(ctx.request.body.password, user.password))) {
      return new HttpResponseUnauthorized();
    }

    return this.generateLoginResponse(user);
  }

  private async generateLoginResponse(user: User): Promise<HttpResponseOK> {
    const payload = {
      email: user.email,
      id: user.id
    };
    const secret = Config.get<string>('settings.jwt.secretOrPublicKey');

    const token = await new Promise<string>((resolve, reject) => {
      sign(
        payload,
        secret,
        { subject: user.id.toString() },
        (err, value: string) => {
          if (err) {
            return reject(err);
          }
          resolve(value);
        }
      );
    });

    return new HttpResponseOK({
      token
    });
  }
}
