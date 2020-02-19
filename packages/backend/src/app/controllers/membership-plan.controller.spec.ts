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
import { MembershipPlan } from '../entities';
import { MembershipPlanController } from './membership-plan.controller';
import { TypeOfFacturation } from '../entities/membership-plan.entity';

describe('MembershipPlanController', () => {

  let controller: MembershipPlanController;
  let membershipPlan1: MembershipPlan;
  let membershipPlan2: MembershipPlan;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(MembershipPlanController);

    const repository = getRepository(MembershipPlan);
    await repository.clear();
    [ membershipPlan1, membershipPlan2 ] = await repository.save([
      {
        designation: 'MembershipPlan 1',
        amount:20,
        typeOfFacturation:TypeOfFacturation.WEEKLY
      },
      {
        designation: 'MembershipPlan 2',
        amount:60,
        typeOfFacturation:TypeOfFacturation.QUARTERLY
      },
    ]);
  });

  describe('has a "findMembershipPlans" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'findMembershipPlans'), 'GET');
      strictEqual(getPath(MembershipPlanController, 'findMembershipPlans'), undefined);
    });

    it('should return an HttpResponseOK object with the membershipPlan list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findMembershipPlans(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of membershipPlans.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(membershipPlan => membershipPlan.designation === membershipPlan1.designation));
      ok(response.body.find(membershipPlan => membershipPlan.designation === membershipPlan2.designation));
    });

    it('should support pagination', async () => {
      const membershipPlan3 = await getRepository(MembershipPlan).save({
        designation: 'MembershipPlan 3',
        amount:100,
        typeOfFacturation:TypeOfFacturation.QUARTERLY
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findMembershipPlans(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(membershipPlan => membershipPlan.id === membershipPlan1.id));
      ok(response.body.find(membershipPlan => membershipPlan.id === membershipPlan2.id));
      ok(!response.body.find(membershipPlan => membershipPlan.id === membershipPlan3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findMembershipPlans(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(membershipPlan => membershipPlan.id === membershipPlan1.id));
      ok(response.body.find(membershipPlan => membershipPlan.id === membershipPlan2.id));
      ok(response.body.find(membershipPlan => membershipPlan.id === membershipPlan3.id));
    });

  });

  describe('has a "findMembershipPlanById" method that', () => {

    it('should handle requests at GET /:membershipPlanId.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'findMembershipPlanById'), 'GET');
      strictEqual(getPath(MembershipPlanController, 'findMembershipPlanById'), '/:membershipPlanId');
    });

    it('should return an HttpResponseOK object if the membershipPlan was found.', async () => {
      const ctx = new Context({
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      const response = await controller.findMembershipPlanById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, membershipPlan2.id);
      strictEqual(response.body.designation, membershipPlan2.designation);
    });

    it('should return an HttpResponseNotFound object if the membershipPlan was not found.', async () => {
      const ctx = new Context({
        params: {
          membershipPlanId: -1
        }
      });
      const response = await controller.findMembershipPlanById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createMembershipPlan" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'createMembershipPlan'), 'POST');
      strictEqual(getPath(MembershipPlanController, 'createMembershipPlan'), undefined);
    });

    it('should create the membershipPlan in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          designation: 'MembershipPlan 3',
          amount:100,
          typeOfFacturation:TypeOfFacturation.QUARTERLY
        }
      });
      const response = await controller.createMembershipPlan(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const membershipPlan = await getRepository(MembershipPlan).findOne({ designation: 'MembershipPlan 3' });

      if (!membershipPlan) {
        throw new Error('No membershipPlan 3 was found in the database.');
      }

      strictEqual(membershipPlan.designation, 'MembershipPlan 3');

      strictEqual(response.body.id, membershipPlan.id);
      strictEqual(response.body.designation, membershipPlan.designation);
    });

  });

  describe('has a "modifyMembershipPlan" method that', () => {

    it('should handle requests at PATCH /:membershipPlanId.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'modifyMembershipPlan'), 'PATCH');
      strictEqual(getPath(MembershipPlanController, 'modifyMembershipPlan'), '/:membershipPlanId');
    });

    it('should update the membershipPlan in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          designation: 'MembershipPlan 2 (version 2)',
        },
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      const response = await controller.modifyMembershipPlan(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan2.id);

      if (!membershipPlan) {
        throw new Error();
      }

      strictEqual(membershipPlan.designation, 'MembershipPlan 2 (version 2)');

      strictEqual(response.body.id, membershipPlan.id);
      strictEqual(response.body.designation, membershipPlan.designation);
    });

    it('should not update the other membershipPlans.', async () => {
      const ctx = new Context({
        body: {
          designation: 'MembershipPlan 2 (version 2)',
        },
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      await controller.modifyMembershipPlan(ctx);

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan1.id);

      if (!membershipPlan) {
        throw new Error();
      }

      notStrictEqual(membershipPlan.designation, 'MembershipPlan 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          designation: '',
        },
        params: {
          membershipPlanId: -1
        }
      });
      const response = await controller.modifyMembershipPlan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceMembershipPlan" method that', () => {

    it('should handle requests at PUT /:membershipPlanId.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'replaceMembershipPlan'), 'PUT');
      strictEqual(getPath(MembershipPlanController, 'replaceMembershipPlan'), '/:membershipPlanId');
    });

    it('should update the membershipPlan in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          designation: 'MembershipPlan 2 (version 2)',
        },
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      const response = await controller.replaceMembershipPlan(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan2.id);

      if (!membershipPlan) {
        throw new Error();
      }

      strictEqual(membershipPlan.designation, 'MembershipPlan 2 (version 2)');

      strictEqual(response.body.id, membershipPlan.id);
      strictEqual(response.body.designation, membershipPlan.designation);
    });

    it('should not update the other membershipPlans.', async () => {
      const ctx = new Context({
        body: {
          designation: 'MembershipPlan 2 (version 2)',
        },
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      await controller.replaceMembershipPlan(ctx);

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan1.id);

      if (!membershipPlan) {
        throw new Error();
      }

      notStrictEqual(membershipPlan.designation, 'MembershipPlan 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          designation: '',
        },
        params: {
          membershipPlanId: -1
        }
      });
      const response = await controller.replaceMembershipPlan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteMembershipPlan" method that', () => {

    it('should handle requests at DELETE /:membershipPlanId.', () => {
      strictEqual(getHttpMethod(MembershipPlanController, 'deleteMembershipPlan'), 'DELETE');
      strictEqual(getPath(MembershipPlanController, 'deleteMembershipPlan'), '/:membershipPlanId');
    });

    it('should delete the membershipPlan and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      const response = await controller.deleteMembershipPlan(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan2.id);

      strictEqual(membershipPlan, undefined);
    });

    it('should not delete the other membershipPlans.', async () => {
      const ctx = new Context({
        params: {
          membershipPlanId: membershipPlan2.id
        }
      });
      const response = await controller.deleteMembershipPlan(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const membershipPlan = await getRepository(MembershipPlan).findOne(membershipPlan1.id);

      notStrictEqual(membershipPlan, undefined);
    });

    it('should return an HttpResponseNotFound if the membershipPlan was not fond.', async () => {
      const ctx = new Context({
        params: {
          membershipPlanId: -1
        }
      });
      const response = await controller.deleteMembershipPlan(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
