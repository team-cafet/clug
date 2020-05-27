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
import { MemberController } from './member.controller';
import { Member, Sexe, FinancialStatus } from '../entities/member.entity';
import { Club, Address } from '../entities';

// eslint-disable-next-line max-lines-per-function
describe('MemberController', () => {
  let controller: MemberController;
  let simpleMember: Member;
  let memberWithAdditionalProps: Member;
  let club: Club;
  let address: Address;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(MemberController);

    const repository = getRepository(Member);
    const clubRepo = getRepository(Club);
    const addressRepo = getRepository(Address);

    await repository.query(`TRUNCATE ${clubRepo.metadata.tableName} CASCADE`);
    await repository.query(`TRUNCATE ${repository.metadata.tableName} CASCADE`);

    [ club ] = await clubRepo.save([ { designation: 'Club 1' } ]);
    [ address ] = await addressRepo.save([
      {
        street: 'chemin de montétan',
        streetNumber: 1,
        city: 'Lausanne',
        postalCode: 1004,
        country: 'Switzerland'
      }
    ]);

    [ simpleMember, memberWithAdditionalProps ] = await repository.save([
      {
        surname: 'Geralt',
        name: 'Of Rivia',
        email: 'geralt@rivia.com'
      },
      {
        surname: 'Yennefer',
        name: 'Of Vanderberg',
        email: 'yen@vanderberg.com',
        sexe: Sexe.FEMALE,
        phone: '+01 12 123 45 67',
        birthdate: '2019-01-12',
        financialStatus: FinancialStatus.WARNING,
        club,
        address
      }
    ]);
  });

  describe('has a "findMembers" method that', () => {
    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(MemberController, 'findMembers'), 'GET');
      strictEqual(getPath(MemberController, 'findMembers'), undefined);
    });

    it('should return an HttpResponseOK object with the member list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findMembers(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of members.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(member => member.name === simpleMember.name));
      ok(
        response.body.find(
          member => member.name === memberWithAdditionalProps.name
        )
      );
    });

    it('should support pagination', async () => {
      const newMemberForPagination = await getRepository(Member).save({
        name: 'Of Cyntra',
        surname: 'Cyrila',
        email: 'cirla@cyntra.com'
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findMembers(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(member => member.id === simpleMember.id));
      ok(
        response.body.find(member => member.id === memberWithAdditionalProps.id)
      );
      ok(
        !response.body.find(member => member.id === newMemberForPagination.id)
      );

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findMembers(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(member => member.id === simpleMember.id));
      ok(
        response.body.find(member => member.id === memberWithAdditionalProps.id)
      );
      ok(response.body.find(member => member.id === newMemberForPagination.id));
    });
  });

  describe('has a "findMemberById" method that', () => {
    it('should handle requests at GET /:memberId.', () => {
      strictEqual(getHttpMethod(MemberController, 'findMemberById'), 'GET');
      strictEqual(getPath(MemberController, 'findMemberById'), '/:memberId');
    });

    it('should return an HttpResponseOK object if the member was found.', async () => {
      const ctx = new Context({
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      const response = await controller.findMemberById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      strictEqual(response.body.id, memberWithAdditionalProps.id);
      strictEqual(response.body.name, memberWithAdditionalProps.name);
    });

    it('should return an HttpResponseNotFound object if the member was not found.', async () => {
      const ctx = new Context({
        params: {
          memberId: -1
        }
      });
      const response = await controller.findMemberById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "createMember" method that', () => {
    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(MemberController, 'createMember'), 'POST');
      strictEqual(getPath(MemberController, 'createMember'), undefined);
    });

    it(
      'should create the member in the database and return it through ' +
        'an HttpResponseCreated object.',
      async () => {
        const ctx = new Context({
          body: {
            name: 'Of Cyntra',
            surname: 'Cyrila',
            email: 'cirla@cyntra.com'
          }
        });
        const response = await controller.createMember(ctx);

        if (!isHttpResponseCreated(response)) {
          throw new Error(
            'The returned value should be an HttpResponseCreated object.'
          );
        }

        const member = await getRepository(Member).findOne({
          name: 'Of Cyntra'
        });

        if (!member) {
          throw new Error('No Cyrila Of Cintra was found in the database.');
        }

        strictEqual(member.name, 'Of Cyntra');

        strictEqual(response.body.id, member.id);
        strictEqual(response.body.name, member.name);
      }
    );
  });

  describe('has a "modifyMember" method that', () => {
    it('should handle requests at PATCH /:memberId.', () => {
      strictEqual(getHttpMethod(MemberController, 'modifyMember'), 'PATCH');
      strictEqual(getPath(MemberController, 'modifyMember'), '/:memberId');
    });

    it('should update the member in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          name: 'Member 2 (version 2)'
        },
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      const response = await controller.modifyMember(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      const member = await getRepository(Member).findOne(
        memberWithAdditionalProps.id
      );

      if (!member) {
        throw new Error();
      }

      strictEqual(member.name, 'Member 2 (version 2)');

      strictEqual(response.body.id, member.id);
      strictEqual(response.body.name, member.name);
    });

    it('should not update the other members.', async () => {
      const ctx = new Context({
        body: {
          name: 'Member 2 (version 2)'
        },
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      await controller.modifyMember(ctx);
      const member = await getRepository(Member).findOne(simpleMember.id);

      if (!member) {
        throw new Error();
      }
      notStrictEqual(member.name, 'Member 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: ''
        },
        params: {
          memberId: -1
        }
      });
      const response = await controller.modifyMember(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "replaceMember" method that', () => {
    it('should handle requests at PUT /:memberId.', () => {
      strictEqual(getHttpMethod(MemberController, 'replaceMember'), 'PUT');
      strictEqual(getPath(MemberController, 'replaceMember'), '/:memberId');
    });

    it('should update the member in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          name: 'Member 2 (version 2)'
        },
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      const response = await controller.replaceMember(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error(
          'The returned value should be an HttpResponseOK object.'
        );
      }

      const member = await getRepository(Member).findOne(
        memberWithAdditionalProps.id
      );

      if (!member) {
        throw new Error();
      }

      strictEqual(member.name, 'Member 2 (version 2)');

      strictEqual(response.body.id, member.id);
      strictEqual(response.body.name, member.name);
    });

    it('should not update the other members.', async () => {
      const ctx = new Context({
        body: {
          name: 'Member 2 (version 2)'
        },
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      await controller.replaceMember(ctx);

      const member = await getRepository(Member).findOne(simpleMember.id);
      if (!member) {
        throw new Error();
      }

      notStrictEqual(member.name, 'Member 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: ''
        },
        params: {
          memberId: -1
        }
      });
      const response = await controller.replaceMember(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });

  describe('has a "deleteMember" method that', () => {
    it('should handle requests at DELETE /:memberId.', () => {
      strictEqual(getHttpMethod(MemberController, 'deleteMember'), 'DELETE');
      strictEqual(getPath(MemberController, 'deleteMember'), '/:memberId');
    });

    it('should delete the member and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      const response = await controller.deleteMember(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNoContent object.'
        );
      }

      const member = await getRepository(Member).findOne(
        memberWithAdditionalProps.id
      );

      strictEqual(member, undefined);
    });

    it('should not delete the other members.', async () => {
      const ctx = new Context({
        params: {
          memberId: memberWithAdditionalProps.id
        }
      });
      const response = await controller.deleteMember(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNoContent object.'
        );
      }

      const member = await getRepository(Member).findOne(simpleMember.id);

      notStrictEqual(member, undefined);
    });

    it('should return an HttpResponseNotFound if the member was not fond.', async () => {
      const ctx = new Context({
        params: {
          memberId: -1
        }
      });
      const response = await controller.deleteMember(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error(
          'The returned value should be an HttpResponseNotFound object.'
        );
      }
    });
  });
});
