/* eslint-disable @typescript-eslint/no-explicit-any */

import request from 'supertest';
import { initApp } from '../src/app';
import { loadORM } from '../src/util/loadorm';
import express from 'express';
import { Connection } from 'typeorm';
import { loadEnv } from '../src/util/loadenv';
import { AuthCtrl } from '../src/controllers/auth';
import { executeTestSeeder } from '../src/seeds';
import { PlanType } from '../src/models/MembershipPlan';

const API_ENDPOINT = '/api/memberships';

describe('Functionnal Membership endpoint testing', () => {
  let app: express.Express;
  let connection: Connection;
  let adminUser;
  let managerUser;
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
      //managerUser = await authCtrl.login('manager@test.ch', '1234');
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

    // Maybe we want not to be able to modify a membership
    // it('PUT', async (done) => {
    //   request(app)
    //     .put(`${API_ENDPOINT}/1`)
    //     .auth(adminUser.token, { type: 'bearer' })
    //     .send({
    //       endDate: '2020-02-01'
    //     })
    //     .expect(200, done);
    // });

    it('POST', async (done) => {
      request(app)
        .post(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .send({
          member: { id: 2 },
          startDate: '2020-08-01',
          endDate: '2020-09-01',
          plan: { id: 2 }
        })
        .expect(200, done);
    });

    it('DELETE', async (done) => {
      request(app)
        .delete(`${API_ENDPOINT}/1`)
        .auth(adminUser.token, { type: 'bearer' })
        .expect(200, done);
    });

    it('Should not have the endate before the startdate', async (done) => {
      request(app)
        .post(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .send({
          member: { id: 2 },
          startDate: '2020-09-01',
          endDate: '2020-06-01',
          plan: { id: 2 }
        })
        .expect(400, done);
    });

    it('should not have multiple memership active for the same member', async (done) => {
      request(app)
        .post(API_ENDPOINT)
        .auth(adminUser.token, { type: 'bearer' })
        .send({
          member: { id: 2 },
          startDate: '2020-07-01',
          endDate: '2020-10-01',
          plan: { id: 2 }
        })
        .expect(400, done);
    });
  });

  describe('Testing with manager', () => {
    //
  });

  describe('Testing with a simple user', () => {
    //
  });

  afterAll(async () => {
    connection.close();
  });
});
