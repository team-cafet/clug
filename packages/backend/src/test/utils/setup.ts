import 'reflect-metadata';
import 'source-map-support/register';
import { config } from 'dotenv';
import express from 'express';
import supertest from 'supertest';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import { initApp } from '../../app';
import { DatabaseSeeds } from '../../seeds/DatabaseSeeds';
import { AuthCtrl } from '../../controllers/auth';

process.env.NODE_ENV = 'test';
config();

/**
 * TestFactory
 * - Loaded in each unit test
 * - Starts server and DB connection
 */

export class TestFactory {
  private _app: express.Application;
  private _connection: Connection;
  private _server: HttpServer;
  private _staffToken: string;

  // DB connection options
  private options: ConnectionOptions = {
    type: 'sqljs',
    database: new Uint8Array(),
    location: 'database',
    logging: false,
    synchronize: true,
    entities: ['build/models/**/*.js'],
  };

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public get connection(): Connection {
    return this._connection;
  }

  public get server(): HttpServer {
    return this._server;
  }

  public get staffToken(): string {
    return this._staffToken;
  }

  /**
   * Connect to DB and start server
   */
  public async init(): Promise<void> {
    this._connection = await createConnection(this.options);

    const dbSeeds = new DatabaseSeeds();
    await dbSeeds.run(false, false);

    this._app = initApp();
    this._server = createServer(this._app).listen(process.env.NODE_PORT);

    const authCtrl = new AuthCtrl();
    const staffUser = await authCtrl.login('staff', '1234');
    this._staffToken = staffUser.token;
  }

  /**
   * Close server and DB connection
   */
  public async close(): Promise<void> {
    this._server.close();
    this._connection.close();
  }
}
