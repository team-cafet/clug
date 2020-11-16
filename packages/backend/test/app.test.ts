import request from 'supertest';
import { initApp } from '../src/app';
import { loadORM } from '../src/util/loadorm';
import express from 'express';
import { Connection } from 'typeorm';
import { executeTestSeeder } from '../src/seeds/index';
import {loadEnv} from '../src/util/loadenv';

describe('Functionnal App testing', () => {
  let app: express.Express;
  let connection: Connection;

  beforeAll(async () => {
    try {
      loadEnv();
      connection = await loadORM();

      await executeTestSeeder();

      app = initApp();
    } catch (err) {
      throw err;
    }
  });

  it('should return 404', async (done) => {
    request(app).post('/givemea404').expect(404, done);
  });

  afterAll(async () => {
    connection.close();
  });
});
