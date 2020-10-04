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
    request(app).get('/reset').expect(404, done);
  });

  // -------------------------- API

  // -------------------------- API -> organisations

  // describe('Testing organisation api', () => {
  //   it('POST', async (done) => {
  //     request(app)
  //       .post('/api/organisations')
  //       .send({
  //         name: 'organisation-test'
  //       })
  //       .expect(200, done);
  //   });
  // });

  // -------------------------- API -> clubs

  // describe('Testing club api', () => {
  //   it('POST', async (done) => {
  //     request(app)
  //       .post('/api/clubs')
  //       .send({
  //         organisation: {id: 1},
  //         name: 'club-test'
  //       })
  //       .expect(200, done);
  //   });
  // });

  afterAll(async () => {
    connection.close();
  });
});
