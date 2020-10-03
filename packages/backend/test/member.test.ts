/* eslint-disable @typescript-eslint/no-explicit-any */

import request from 'supertest';
import { initApp } from '../src/app';
import { loadORM } from '../src/util/loadorm';
import express from 'express';
import { Connection } from 'typeorm';
import { loadEnv } from '../src/util/loadenv';
import { AuthCtrl } from '../src/controllers/auth';
import { executeTestSeeder } from '../src/seeds';

const API_ENDPOINT = '/api/members';

describe('Functionnal Member endpoint testing', () => {
  let app: express.Express;
  let connection: Connection;
  let adminUser;
  // let managerUser;
  let staffUser;
  let memberUser;

  beforeAll(async () => {
    try {
      loadEnv();
      connection = await loadORM();
      app = initApp();

      await executeTestSeeder();

      const authCtrl = new AuthCtrl();
      adminUser = await authCtrl.login('admin', '1234');
      // managerUser = await authCtrl.login('manager@test.ch', '1234');
      staffUser = await authCtrl.login('staff', '1234');
      memberUser = await authCtrl.login('user-test', '1234');
      
    } catch (err) {
      throw err;
    }
  });

  describe('Basic Testing members api with admin', () => {
    it('POST', async (done) => {
      request(app)
        .post(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .send({
          organisation: { id: 1 },
          user: { email: 'test@test.ch', password: '1234' }
        })
        .expect(200, done);
    });

    it('GET ALL', async (done) => {
      request(app)
        .get(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .expect(200, done);
    });

    it('GET ONE', async (done) => {
      request(app)
        .get(API_ENDPOINT+'/1')
        .auth(adminUser.token, { type: 'bearer' })
        .expect(200, done);
    });

    it('PUT', async (done) => {
      request(app)
        .put(API_ENDPOINT+'/1')
        .auth(adminUser.token, { type: 'bearer' })
        .send({
          user: { email: 'test-updated@test.ch', password: '12346' }
        })
        .expect(200, done);
    });

  });

  describe('Testing with staff', () => {
    it('Staff can not post a member that is not in his org', async (done) => {
      request(app)
        .post(API_ENDPOINT)
        .auth(staffUser.token, { type: 'bearer' })
        .send({
          organisation: { id: 2 },
          user: { email: 'newuserstaff@test.ch', password: '1234' }
        })
        .expect(403, done);
    });

    it('Staff can not update a member that is not in his org', async (done) => {
      request(app)
        .put(API_ENDPOINT+'/2')
        .auth(staffUser.token, { type: 'bearer' })
        .send({
          user: { email: 'newuserstaff@test.ch', password: '1234123' }
        })
        .expect(403, done);
    });
  });

  describe('Testing with a simple user', () => {
    it('A simple member can update only himself', async (done) => {
      request(app)
        .put(API_ENDPOINT+'/2')
        .auth(memberUser.token, { type: 'bearer' })
        .send({
          user: { email: 'newuser@test.ch', password: '1234123' }
        })
        .expect(403, done);
    });
  });

  afterAll(async () => {
    connection.close();
  });
});
