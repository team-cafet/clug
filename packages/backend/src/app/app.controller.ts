import { controller, Get, Context, HttpResponseNotFound, createHttpResponseFile } from '@foal/core';
import { AddressController, ApiController, StatisticController } from './controllers';
import { AuthController } from './controllers/auth.controller';


export class AppController {
  subControllers = [
    controller('/api/v1', ApiController),
    controller('/api/v1/auth', AuthController)
  ];

  @Get('/fr/*')
  renderAppFr(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return createHttpResponseFile({
      directory: './public/fr',
      file: 'index.html'
    });
  }
  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return createHttpResponseFile({
      directory: './public/en-US',
      file: 'index.html'
    });
  }
}
