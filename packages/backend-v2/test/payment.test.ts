/* eslint-disable @typescript-eslint/no-explicit-any */

import request from 'supertest';
import { initApp } from '../src/app';
import { loadORM } from '../src/util/loadorm';
import express from 'express';
import { Connection } from 'typeorm';
import { loadEnv } from '../src/util/loadenv';
import { AuthCtrl } from '../src/controllers/auth';
import { executeTestSeeder } from '../src/seeds';

const API_ENDPOINT = '/api/payments';

describe('Functionnal Payment endpoint testing', () => {
  let app: express.Express;
  let connection: Connection;
  let adminUser;
  // let managerUser;
  // let staffUser;
  // let memberUser;

  beforeAll(async () => {
    try {
      loadEnv();
      connection = await loadORM();
      app = initApp();

      await executeTestSeeder();

      const authCtrl = new AuthCtrl();
      adminUser = await authCtrl.login('admin', '1234');
      // managerUser = await authCtrl.login('manager@test.ch', '1234');
      // staffUser = await authCtrl.login('staff@test.ch', '1234');
      // memberUser = await authCtrl.login('user@test.ch', '1234');
      
    } catch (err) {
      throw err;
    }
  });

  describe('Basic Testing with admin', () => {

    it('GET ALL', async (done) => {
      request(app)
        .get(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .expect(200, done);
    });

    it('GET ONE', async (done) => {
      request(app)
        .get(`${API_ENDPOINT}/1`)
        .auth(adminUser.token, { type: 'bearer' })
        .expect(200, done);
    });

    // it('PUT', async (done) => {
    //   request(app)
    //     .put(`${API_ENDPOINT}/1`)
    //     .auth(adminUser.token, { type: 'bearer' })
    //     .send({
    //       user: { email: 'test-updated@test.ch', password: '12346' }
    //     })
    //     .expect(200, done);
    // });

    // it('POST', async (done) => {
    //   request(app)
    //     .post(API_ENDPOINT)
    //     .auth(adminUser.token, { type: 'bearer' })
    //     .send({
    //       organisation: { id: 1 },
    //       user: { email: 'test@test.ch', password: '1234' }
    //     })
    //     .expect(200, done);
    // });

  });

  describe('Testing with staff', () => {
    //
  });

  describe('Testing with a simple user', () => {
    //
  });

  afterAll(async () => {
    connection.close();
  });
});
