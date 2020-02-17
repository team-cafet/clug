import { controller } from '@foal/core';

import { ApiController, ClubController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api/v1', ApiController),
  ];
}
