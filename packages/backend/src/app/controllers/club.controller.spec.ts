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
import { Club } from '../entities';
import { ClubController } from './club.controller';

describe('ClubController', () => {

  let controller: ClubController;
  let club1: Club;
  let club2: Club;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(ClubController);

    const repository = getRepository(Club);
    await repository.clear();
    [ club1, club2 ] = await repository.save([
      {
        text: 'Club 1'
      },
      {
        text: 'Club 2'
      },
    ]);
  });

  describe('has a "findClubs" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ClubController, 'findClubs'), 'GET');
      strictEqual(getPath(ClubController, 'findClubs'), undefined);
    });

    it('should return an HttpResponseOK object with the club list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findClubs(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of clubs.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(club => club.text === club1.text));
      ok(response.body.find(club => club.text === club2.text));
    });

    it('should support pagination', async () => {
      const club3 = await getRepository(Club).save({
        text: 'Club 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findClubs(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(club => club.id === club1.id));
      ok(response.body.find(club => club.id === club2.id));
      ok(!response.body.find(club => club.id === club3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findClubs(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(club => club.id === club1.id));
      ok(response.body.find(club => club.id === club2.id));
      ok(response.body.find(club => club.id === club3.id));
    });

  });

  describe('has a "findClubById" method that', () => {

    it('should handle requests at GET /:clubId.', () => {
      strictEqual(getHttpMethod(ClubController, 'findClubById'), 'GET');
      strictEqual(getPath(ClubController, 'findClubById'), '/:clubId');
    });

    it('should return an HttpResponseOK object if the club was found.', async () => {
      const ctx = new Context({
        params: {
          clubId: club2.id
        }
      });
      const response = await controller.findClubById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, club2.id);
      strictEqual(response.body.text, club2.text);
    });

    it('should return an HttpResponseNotFound object if the club was not found.', async () => {
      const ctx = new Context({
        params: {
          clubId: -1
        }
      });
      const response = await controller.findClubById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createClub" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(ClubController, 'createClub'), 'POST');
      strictEqual(getPath(ClubController, 'createClub'), undefined);
    });

    it('should create the club in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Club 3',
        }
      });
      const response = await controller.createClub(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const club = await getRepository(Club).findOne({ text: 'Club 3' });

      if (!club) {
        throw new Error('No club 3 was found in the database.');
      }

      strictEqual(club.text, 'Club 3');

      strictEqual(response.body.id, club.id);
      strictEqual(response.body.text, club.text);
    });

  });

  describe('has a "modifyClub" method that', () => {

    it('should handle requests at PATCH /:clubId.', () => {
      strictEqual(getHttpMethod(ClubController, 'modifyClub'), 'PATCH');
      strictEqual(getPath(ClubController, 'modifyClub'), '/:clubId');
    });

    it('should update the club in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Club 2 (version 2)',
        },
        params: {
          clubId: club2.id
        }
      });
      const response = await controller.modifyClub(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const club = await getRepository(Club).findOne(club2.id);

      if (!club) {
        throw new Error();
      }

      strictEqual(club.text, 'Club 2 (version 2)');

      strictEqual(response.body.id, club.id);
      strictEqual(response.body.text, club.text);
    });

    it('should not update the other clubs.', async () => {
      const ctx = new Context({
        body: {
          text: 'Club 2 (version 2)',
        },
        params: {
          clubId: club2.id
        }
      });
      await controller.modifyClub(ctx);

      const club = await getRepository(Club).findOne(club1.id);

      if (!club) {
        throw new Error();
      }

      notStrictEqual(club.text, 'Club 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          clubId: -1
        }
      });
      const response = await controller.modifyClub(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceClub" method that', () => {

    it('should handle requests at PUT /:clubId.', () => {
      strictEqual(getHttpMethod(ClubController, 'replaceClub'), 'PUT');
      strictEqual(getPath(ClubController, 'replaceClub'), '/:clubId');
    });

    it('should update the club in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Club 2 (version 2)',
        },
        params: {
          clubId: club2.id
        }
      });
      const response = await controller.replaceClub(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const club = await getRepository(Club).findOne(club2.id);

      if (!club) {
        throw new Error();
      }

      strictEqual(club.text, 'Club 2 (version 2)');

      strictEqual(response.body.id, club.id);
      strictEqual(response.body.text, club.text);
    });

    it('should not update the other clubs.', async () => {
      const ctx = new Context({
        body: {
          text: 'Club 2 (version 2)',
        },
        params: {
          clubId: club2.id
        }
      });
      await controller.replaceClub(ctx);

      const club = await getRepository(Club).findOne(club1.id);

      if (!club) {
        throw new Error();
      }

      notStrictEqual(club.text, 'Club 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          clubId: -1
        }
      });
      const response = await controller.replaceClub(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteClub" method that', () => {

    it('should handle requests at DELETE /:clubId.', () => {
      strictEqual(getHttpMethod(ClubController, 'deleteClub'), 'DELETE');
      strictEqual(getPath(ClubController, 'deleteClub'), '/:clubId');
    });

    it('should delete the club and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          clubId: club2.id
        }
      });
      const response = await controller.deleteClub(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const club = await getRepository(Club).findOne(club2.id);

      strictEqual(club, undefined);
    });

    it('should not delete the other clubs.', async () => {
      const ctx = new Context({
        params: {
          clubId: club2.id
        }
      });
      const response = await controller.deleteClub(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const club = await getRepository(Club).findOne(club1.id);

      notStrictEqual(club, undefined);
    });

    it('should return an HttpResponseNotFound if the club was not fond.', async () => {
      const ctx = new Context({
        params: {
          clubId: -1
        }
      });
      const response = await controller.deleteClub(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
