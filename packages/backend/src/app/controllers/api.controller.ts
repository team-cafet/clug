import { Context, Get, HttpResponseOK, controller } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { fetchUserWithPermissions } from '@foal/typeorm';
import { User } from '../entities';

import { MemberController } from './member.controller';
import { MembershipPlanController } from './membership-plan.controller';
import { ClubController } from './club.controller';
import { LevelController } from './level.controller';
import { StatisticController } from './statistic.controller';
import { AddressController } from './address.controller';

@JWTRequired({ user: fetchUserWithPermissions(User) })
export class ApiController {

  subControllers = [
    controller('/member', MemberController),
    controller('/membership-plan', MembershipPlanController),
    controller('/club', ClubController),
    controller('/level', LevelController),
    controller('/statistic', StatisticController),
    controller('/address', AddressController)
  ];

  @Get('/')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index(ctx: Context) {
    return new HttpResponseOK('List of endpoint:');
  }

}
