import { controller, Get, Context, HttpResponseNotFound, createHttpResponseFile } from '@foal/core';
import { ApiController } from './controllers';
import { AuthController } from './controllers/auth.controller';


export class AppController {
  subControllers = [
    controller('/api/v1', ApiController),
    controller('/api/v1/auth', AuthController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return createHttpResponseFile({
      directory: './public',
      file: 'index.html'
    });
  }
}
