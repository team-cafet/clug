// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { StatisticController } from './statistic.controller';

describe('StatisticController', () => {

  let controller: StatisticController;

  beforeEach(() => {
    controller = createController(StatisticController);
  });

  // TODO

});
