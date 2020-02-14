import { Context, Get, HttpResponseOK, controller } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { fetchUserWithPermissions } from '@foal/typeorm';
import { User } from '../entities';
import { MemberController } from './member.controller';

@JWTRequired({
  user:fetchUserWithPermissions(User)
})
export class ApiController {

  subControllers = [
    controller('/member', MemberController)
  ]

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('List of endpoint:');
  }

}
