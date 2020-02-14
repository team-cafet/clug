import { Context, Get, HttpResponseOK, controller } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { AuthController } from './auth.controller';
import { fetchUserWithPermissions } from '@foal/typeorm';
import { User } from '../entities';

export class ApiController {

  subControllers = [
    controller('/auth', AuthController),
  ]

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('List of endpoint:');
  }

  @Get('/protected')
  @JWTRequired({user:fetchUserWithPermissions(User)})
  testOfProtectedRoute(ctx:Context) {
    return new HttpResponseOK('You are authentified')
  }

}
