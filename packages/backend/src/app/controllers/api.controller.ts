import { Context, Get, HttpResponseOK, controller } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { AuthController } from './auth.controller';
import { ClubController } from './club.controller';

export class ApiController {

  subControllers = [
    controller('/auth', AuthController),
    controller('/club', ClubController),
  ]

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('List of endpoint:');
  }

  @Get('/protected')
  @JWTRequired()
  testOfProtectedRoute(ctx:Context) {
    return new HttpResponseOK('You are authentified')
  }

}
