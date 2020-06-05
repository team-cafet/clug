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

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(StatisticController, 'foo'), 'GET');
      strictEqual(getPath(StatisticController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
