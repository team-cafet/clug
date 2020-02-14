import { controller } from '@foal/core';

import { ApiController } from './controllers';
import { AuthController } from './controllers/auth.controller';

export class AppController {
  subControllers = [
    controller('/api/v1', ApiController),
    controller('/api/v1/auth', AuthController)
  ];
}
