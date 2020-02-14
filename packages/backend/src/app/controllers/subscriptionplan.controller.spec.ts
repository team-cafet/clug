// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { createConnection, getConnection, getRepository } from 'typeorm';

// App
import { SubscriptionPlan } from '../entities';
import { SubscriptionPlanController } from './subscriptionplan.controller';
import { TypeOfFacturation } from '../entities/subscriptionplan.entity';

describe('SubscriptionplanController', () => {

  let controller: SubscriptionPlanController;
  let subscriptionplan1: SubscriptionPlan;
  let subscriptionplan2: SubscriptionPlan;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(SubscriptionPlanController);

    const repository = getRepository(SubscriptionPlan);
    await repository.clear();
    [ subscriptionplan1, subscriptionplan2 ] = await repository.save([
      {
        amount:10,
        description:'Basic plan',
        dateOfInvoicing:'2010-01-01',
        typeOfFacturation: TypeOfFacturation.MONTHLY
      },
      {
        text: 'Subscriptionplan 2'
      },
    ]);
  });

  describe('has a "findSubscriptionplans" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'findSubscriptionplans'), 'GET');
      strictEqual(getPath(SubscriptionPlanController, 'findSubscriptionplans'), undefined);
    });

    it('should return an HttpResponseOK object with the subscriptionplan list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findSubscriptionplans(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of subscriptionplans.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(subscriptionplan => subscriptionplan.text === subscriptionplan1.text));
      ok(response.body.find(subscriptionplan => subscriptionplan.text === subscriptionplan2.text));
    });

    it('should support pagination', async () => {
      const subscriptionplan3 = await getRepository(SubscriptionPlan).save({
        text: 'Subscriptionplan 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findSubscriptionplans(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan1.id));
      ok(response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan2.id));
      ok(!response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findSubscriptionplans(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan1.id));
      ok(response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan2.id));
      ok(response.body.find(subscriptionplan => subscriptionplan.id === subscriptionplan3.id));
    });

  });

  describe('has a "findSubscriptionplanById" method that', () => {

    it('should handle requests at GET /:subscriptionplanId.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'findSubscriptionplanById'), 'GET');
      strictEqual(getPath(SubscriptionPlanController, 'findSubscriptionplanById'), '/:subscriptionplanId');
    });

    it('should return an HttpResponseOK object if the subscriptionplan was found.', async () => {
      const ctx = new Context({
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      const response = await controller.findSubscriptionplanById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, subscriptionplan2.id);
      strictEqual(response.body.text, subscriptionplan2.text);
    });

    it('should return an HttpResponseNotFound object if the subscriptionplan was not found.', async () => {
      const ctx = new Context({
        params: {
          subscriptionplanId: -1
        }
      });
      const response = await controller.findSubscriptionplanById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createSubscriptionplan" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'createSubscriptionplan'), 'POST');
      strictEqual(getPath(SubscriptionPlanController, 'createSubscriptionplan'), undefined);
    });

    it('should create the subscriptionplan in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Subscriptionplan 3',
        }
      });
      const response = await controller.createSubscriptionplan(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne({ text: 'Subscriptionplan 3' });

      if (!subscriptionplan) {
        throw new Error('No subscriptionplan 3 was found in the database.');
      }

      strictEqual(subscriptionplan.text, 'Subscriptionplan 3');

      strictEqual(response.body.id, subscriptionplan.id);
      strictEqual(response.body.text, subscriptionplan.text);
    });

  });

  describe('has a "modifySubscriptionplan" method that', () => {

    it('should handle requests at PATCH /:subscriptionplanId.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'modifySubscriptionplan'), 'PATCH');
      strictEqual(getPath(SubscriptionPlanController, 'modifySubscriptionplan'), '/:subscriptionplanId');
    });

    it('should update the subscriptionplan in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Subscriptionplan 2 (version 2)',
        },
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      const response = await controller.modifySubscriptionplan(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan2.id);

      if (!subscriptionplan) {
        throw new Error();
      }

      strictEqual(subscriptionplan.text, 'Subscriptionplan 2 (version 2)');

      strictEqual(response.body.id, subscriptionplan.id);
      strictEqual(response.body.text, subscriptionplan.text);
    });

    it('should not update the other subscriptionplans.', async () => {
      const ctx = new Context({
        body: {
          text: 'Subscriptionplan 2 (version 2)',
        },
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      await controller.modifySubscriptionplan(ctx);

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan1.id);

      if (!subscriptionplan) {
        throw new Error();
      }

      notStrictEqual(subscriptionplan.text, 'Subscriptionplan 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          subscriptionplanId: -1
        }
      });
      const response = await controller.modifySubscriptionplan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceSubscriptionplan" method that', () => {

    it('should handle requests at PUT /:subscriptionplanId.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'replaceSubscriptionplan'), 'PUT');
      strictEqual(getPath(SubscriptionPlanController, 'replaceSubscriptionplan'), '/:subscriptionplanId');
    });

    it('should update the subscriptionplan in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Subscriptionplan 2 (version 2)',
        },
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      const response = await controller.replaceSubscriptionplan(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan2.id);

      if (!subscriptionplan) {
        throw new Error();
      }

      strictEqual(subscriptionplan.text, 'Subscriptionplan 2 (version 2)');

      strictEqual(response.body.id, subscriptionplan.id);
      strictEqual(response.body.text, subscriptionplan.text);
    });

    it('should not update the other subscriptionplans.', async () => {
      const ctx = new Context({
        body: {
          text: 'Subscriptionplan 2 (version 2)',
        },
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      await controller.replaceSubscriptionplan(ctx);

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan1.id);

      if (!subscriptionplan) {
        throw new Error();
      }

      notStrictEqual(subscriptionplan.text, 'Subscriptionplan 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          subscriptionplanId: -1
        }
      });
      const response = await controller.replaceSubscriptionplan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteSubscriptionplan" method that', () => {

    it('should handle requests at DELETE /:subscriptionplanId.', () => {
      strictEqual(getHttpMethod(SubscriptionPlanController, 'deleteSubscriptionplan'), 'DELETE');
      strictEqual(getPath(SubscriptionPlanController, 'deleteSubscriptionplan'), '/:subscriptionplanId');
    });

    it('should delete the subscriptionplan and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      const response = await controller.deleteSubscriptionplan(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan2.id);

      strictEqual(subscriptionplan, undefined);
    });

    it('should not delete the other subscriptionplans.', async () => {
      const ctx = new Context({
        params: {
          subscriptionplanId: subscriptionplan2.id
        }
      });
      const response = await controller.deleteSubscriptionplan(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const subscriptionplan = await getRepository(SubscriptionPlan).findOne(subscriptionplan1.id);

      notStrictEqual(subscriptionplan, undefined);
    });

    it('should return an HttpResponseNotFound if the subscriptionplan was not fond.', async () => {
      const ctx = new Context({
        params: {
          subscriptionplanId: -1
        }
      });
      const response = await controller.deleteSubscriptionplan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
