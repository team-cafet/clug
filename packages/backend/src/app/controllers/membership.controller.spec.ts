// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context,
  createController,
  getHttpMethod,
  getPath,
  isHttpResponseCreated,
  isHttpResponseNoContent,
  isHttpResponseNotFound,
  isHttpResponseOK
} from '@foal/core';
import { createConnection, getConnection, getRepository } from 'typeorm';

// App
import { Membership, Member, MembershipPlan } from '../entities';
import { MembershipController } from './membership.controller';

describe('MembershipController', () => {
  let controller: MembershipController;
  let membership1: Membership;
  let membership2: Membership;
  let simpleMember: Member;
  let simpleMembershipPlan: MembershipPlan;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(MembershipController);

    const repository = getRepository(Membership);
    
    await repository.clear();
    await getRepository(Member).query(`TRUNCATE ${getRepository(Member).metadata.tableName} CASCADE`);
    await getRepository(MembershipPlan).query(`TRUNCATE ${getRepository(MembershipPlan).metadata.tableName} CASCADE`);

    simpleMember = await getRepository(Member).save({
      name: 'David',
      surname: 'Jones',
      email: 'david.jones@flyingdutchman.com'
    });

    simpleMembershipPlan = await getRepository(MembershipPlan).save({
      designation: 'Normal Plan',
      amount: 40,
      typeOfFacturation: 1
    });

    [membership1, membership2] = await repository.save([
      {
        startDate: '2018-01-05',
        member: simpleMember,
        membershipPlan: simpleMembershipPlan
      },
      {
        startDate: '2019-10-12',
        endDate: '2020-06-03',
        member: simpleMember,
        membershipPlan: simpleMembershipPlan
      }
    ]);
  });

  describe('has a "findMemberships" method that', () => {
    it('should handle requests at GET /.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'findMemberships'),
        'GET'
      );
      strictEqual(getPath(MembershipController, 'findMemberships'), undefined);
    });

    it('should return an HttpResponseOK object with the membership list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findMemberships(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of memberships.');
      }

      strictEqual(response.body.length, 2);
      ok(
        response.body.find(
          membership => membership.startDate === membership1.startDate
        )
      );
      ok(
        response.body.find(
          membership => membership.startDate === membership2.startDate
        )
      );
    });

    it('should support pagination', async () => {
      const membership3 = await getRepository(Membership).save({
        startDate: '2017-01-01',
        member: simpleMember,
        membershipPlan: simpleMembershipPlan
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findMemberships(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(membership => membership.id === membership1.id));
      ok(response.body.find(membership => membership.id === membership2.id));
      ok(!response.body.find(membership => membership.id === membership3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findMemberships(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(membership => membership.id === membership1.id));
      ok(response.body.find(membership => membership.id === membership2.id));
      ok(response.body.find(membership => membership.id === membership3.id));
    });
  });

  describe('has a "findMembershipById" method that', () => {
    it('should handle requests at GET /:membershipId.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'findMembershipById'),
        'GET'
      );
      strictEqual(
        getPath(MembershipController, 'findMembershipById'),
        '/:membershipId'
      );
    });

    it('should return an HttpResponseOK object if the membership was found.', async () => {
      const ctx = new Context({
        params: {
          membershipId: membership2.id
        }
      });
      const response = await controller.findMembershipById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      strictEqual(response.body.id, membership2.id);
      strictEqual(response.body.startDate, membership2.startDate);
    });

    it('should return an HttpResponseNotFound object if the membership was not found.', async () => {
      const ctx = new Context({
        params: {
          membershipId: -1
        }
      });
      const response = await controller.findMembershipById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "createMembership" method that', () => {
    it('should handle requests at POST /.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'createMembership'),
        'POST'
      );
      strictEqual(getPath(MembershipController, 'createMembership'), undefined);
    });

    it(
      'should create the membership in the database and return it through ' +
        'an HttpResponseCreated object.',
      async () => {
        const ctx = new Context({
          body: {
            startDate: '2017-01-01',
            member: simpleMember,
            membershipPlan: simpleMembershipPlan
          }
        });
        const response = await controller.createMembership(ctx);

        if (!isHttpResponseCreated(response)) {
          throw new Error(
            'The returned value should be an HttpResponseCreated object.'
          );
        }

        const membership = await getRepository(Membership).findOne({
          startDate: '2017-01-01'
        });

        if (!membership) {
          throw new Error('No membership 3 was found in the database.');
        }

        strictEqual(membership.startDate, '2017-01-01');

        strictEqual(response.body.id, membership.id);
        strictEqual(response.body.startDate, membership.startDate);
      }
    );
  });

  describe('has a "modifyMembership" method that', () => {
    it('should handle requests at PATCH /:membershipId.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'modifyMembership'),
        'PATCH'
      );
      strictEqual(
        getPath(MembershipController, 'modifyMembership'),
        '/:membershipId'
      );
    });

    it('should update the membership in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          startDate: '2020-01-01'
        },
        params: {
          membershipId: membership2.id
        }
      });
      const response = await controller.modifyMembership(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      const membership = await getRepository(Membership).findOne(
        membership2.id
      );

      if (!membership) {
        throw new Error();
      }

      strictEqual(membership.startDate, '2020-01-01');

      strictEqual(response.body.id, membership.id);
      strictEqual(response.body.startDate, membership.startDate);
    });

    it('should not update the other memberships.', async () => {
      const ctx = new Context({
        body: {
          startDate: '2020-01-01'
        },
        params: {
          membershipId: membership2.id
        }
      });
      await controller.modifyMembership(ctx);

      const membership = await getRepository(Membership).findOne(
        membership1.id
      );

      if (!membership) {
        throw new Error();
      }

      notStrictEqual(membership.startDate, '2020-01-01');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          startDate: ''
        },
        params: {
          membershipId: -1
        }
      });
      const response = await controller.modifyMembership(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "replaceMembership" method that', () => {
    it('should handle requests at PUT /:membershipId.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'replaceMembership'),
        'PUT'
      );
      strictEqual(
        getPath(MembershipController, 'replaceMembership'),
        '/:membershipId'
      );
    });

    it('should update the membership in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          startDate: '2020-01-01'
        },
        params: {
          membershipId: membership2.id
        }
      });
      const response = await controller.replaceMembership(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      const membership = await getRepository(Membership).findOne(
        membership2.id
      );

      if (!membership) {
        throw new Error();
      }

      strictEqual(membership.startDate, '2020-01-01');

      strictEqual(response.body.id, membership.id);
      strictEqual(response.body.startDate, membership.startDate);
    });

    it('should not update the other memberships.', async () => {
      const ctx = new Context({
        body: {
          startDate: '2020-01-01'
        },
        params: {
          membershipId: membership2.id
        }
      });
      await controller.replaceMembership(ctx);

      const membership = await getRepository(Membership).findOne(
        membership1.id
      );

      if (!membership) {
        throw new Error();
      }

      notStrictEqual(membership.startDate, '2020-01-01');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          startDate: ''
        },
        params: {
          membershipId: -1
        }
      });
      const response = await controller.replaceMembership(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "deleteMembership" method that', () => {
    it('should handle requests at DELETE /:membershipId.', () => {
      strictEqual(
        getHttpMethod(MembershipController, 'deleteMembership'),
        'DELETE'
      );
      strictEqual(
        getPath(MembershipController, 'deleteMembership'),
        '/:membershipId'
      );
    });

    it('should delete the membership and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          membershipId: membership2.id
        }
      });
      const response = await controller.deleteMembership(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNoContent object.'
        );
      }

      const membership = await getRepository(Membership).findOne(
        membership2.id
      );

      strictEqual(membership, undefined);
    });

    it('should not delete the other memberships.', async () => {
      const ctx = new Context({
        params: {
          membershipId: membership2.id
        }
      });
      const response = await controller.deleteMembership(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNoContent object.'
        );
      }

      const membership = await getRepository(Membership).findOne(
        membership1.id
      );

      notStrictEqual(membership, undefined);
    });

    it('should return an HttpResponseNotFound if the membership was not fond.', async () => {
      const ctx = new Context({
        params: {
          membershipId: -1
        }
      });
      const response = await controller.deleteMembership(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });
});
