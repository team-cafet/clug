import { Context, Get, HttpResponseOK, controller } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { fetchUserWithPermissions } from '@foal/typeorm';
import { User } from '../entities';

import { MemberController } from './member.controller';
import { MembershipPlanController } from './membership-plan.controller';
import { AuthController } from './auth.controller';
import { ClubController } from './club.controller';

@JWTRequired({
  user:fetchUserWithPermissions(User)
})
export class ApiController {

  subControllers = [
    controller('/member', MemberController),
    controller('/membership-plan', MembershipPlanController),
    controller('/auth', AuthController),
    controller('/club', ClubController),
  ]

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('List of endpoint:');
  }

}
