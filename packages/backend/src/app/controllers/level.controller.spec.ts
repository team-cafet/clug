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
import { Level } from '../entities';
import { LevelController } from './level.controller';

// eslint-disable-next-line max-lines-per-function
describe('LevelController', () => {

  let controller: LevelController;
  let level1: Level;
  let level2: Level;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(LevelController);

    const repository = getRepository(Level);
    await repository.query(`TRUNCATE ${repository.metadata.tableName} CASCADE`);

    [ level1, level2 ] = await repository.save([
      {
        name: 'Level 1'
      },
      {
        name: 'Level 2'
      }
    ]);
  });

  describe('has a "findLevels" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(LevelController, 'findLevels'), 'GET');
      strictEqual(getPath(LevelController, 'findLevels'), undefined);
    });

    it('should return an HttpResponseOK object with the level list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findLevels(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of levels.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(level => level.name === level1.name));
      ok(response.body.find(level => level.name === level2.name));
    });

    it('should support pagination', async () => {
      const level3 = await getRepository(Level).save({
        name: 'Level 3'
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findLevels(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(level => level.id === level1.id));
      ok(response.body.find(level => level.id === level2.id));
      ok(!response.body.find(level => level.id === level3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findLevels(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(level => level.id === level1.id));
      ok(response.body.find(level => level.id === level2.id));
      ok(response.body.find(level => level.id === level3.id));
    });

  });

  describe('has a "findLevelById" method that', () => {

    it('should handle requests at GET /:levelId.', () => {
      strictEqual(getHttpMethod(LevelController, 'findLevelById'), 'GET');
      strictEqual(getPath(LevelController, 'findLevelById'), '/:levelId');
    });

    it('should return an HttpResponseOK object if the level was found.', async () => {
      const ctx = new Context({
        params: {
          levelId: level2.id
        }
      });
      const response = await controller.findLevelById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, level2.id);
      strictEqual(response.body.name, level2.name);
    });

    it('should return an HttpResponseNotFound object if the level was not found.', async () => {
      const ctx = new Context({
        params: {
          levelId: -1
        }
      });
      const response = await controller.findLevelById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createLevel" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(LevelController, 'createLevel'), 'POST');
      strictEqual(getPath(LevelController, 'createLevel'), undefined);
    });

    it('should create the level in the database and return it through ' +
        'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          name: 'Level 3'
        }
      });
      const response = await controller.createLevel(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const level = await getRepository(Level).findOne({ name: 'Level 3' });

      if (!level) {
        throw new Error('No level 3 was found in the database.');
      }

      strictEqual(level.name, 'Level 3');

      strictEqual(response.body.id, level.id);
      strictEqual(response.body.name, level.name);
    });

  });

  describe('has a "modifyLevel" method that', () => {

    it('should handle requests at PATCH /:levelId.', () => {
      strictEqual(getHttpMethod(LevelController, 'modifyLevel'), 'PATCH');
      strictEqual(getPath(LevelController, 'modifyLevel'), '/:levelId');
    });

    it('should update the level in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          name: 'Level 2 (version 2)'
        },
        params: {
          levelId: level2.id
        }
      });
      const response = await controller.modifyLevel(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const level = await getRepository(Level).findOne(level2.id);

      if (!level) {
        throw new Error();
      }

      strictEqual(level.name, 'Level 2 (version 2)');

      strictEqual(response.body.id, level.id);
      strictEqual(response.body.name, level.name);
    });

    it('should not update the other levels.', async () => {
      const ctx = new Context({
        body: {
          name: 'Level 2 (version 2)'
        },
        params: {
          levelId: level2.id
        }
      });
      await controller.modifyLevel(ctx);

      const level = await getRepository(Level).findOne(level1.id);

      if (!level) {
        throw new Error();
      }

      notStrictEqual(level.name, 'Level 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: ''
        },
        params: {
          levelId: -1
        }
      });
      const response = await controller.modifyLevel(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceLevel" method that', () => {

    it('should handle requests at PUT /:levelId.', () => {
      strictEqual(getHttpMethod(LevelController, 'replaceLevel'), 'PUT');
      strictEqual(getPath(LevelController, 'replaceLevel'), '/:levelId');
    });

    it('should update the level in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          name: 'Level 2 (version 2)'
        },
        params: {
          levelId: level2.id
        }
      });
      const response = await controller.replaceLevel(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const level = await getRepository(Level).findOne(level2.id);

      if (!level) {
        throw new Error();
      }

      strictEqual(level.name, 'Level 2 (version 2)');

      strictEqual(response.body.id, level.id);
      strictEqual(response.body.name, level.name);
    });

    it('should not update the other levels.', async () => {
      const ctx = new Context({
        body: {
          name: 'Level 2 (version 2)'
        },
        params: {
          levelId: level2.id
        }
      });
      await controller.replaceLevel(ctx);

      const level = await getRepository(Level).findOne(level1.id);

      if (!level) {
        throw new Error();
      }

      notStrictEqual(level.name, 'Level 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          name: ''
        },
        params: {
          levelId: -1
        }
      });
      const response = await controller.replaceLevel(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteLevel" method that', () => {

    it('should handle requests at DELETE /:levelId.', () => {
      strictEqual(getHttpMethod(LevelController, 'deleteLevel'), 'DELETE');
      strictEqual(getPath(LevelController, 'deleteLevel'), '/:levelId');
    });

    it('should delete the level and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          levelId: level2.id
        }
      });
      const response = await controller.deleteLevel(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const level = await getRepository(Level).findOne(level2.id);

      strictEqual(level, undefined);
    });

    it('should not delete the other levels.', async () => {
      const ctx = new Context({
        params: {
          levelId: level2.id
        }
      });
      const response = await controller.deleteLevel(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const level = await getRepository(Level).findOne(level1.id);

      notStrictEqual(level, undefined);
    });

    it('should return an HttpResponseNotFound if the level was not fond.', async () => {
      const ctx = new Context({
        params: {
          levelId: -1
        }
      });
      const response = await controller.deleteLevel(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
