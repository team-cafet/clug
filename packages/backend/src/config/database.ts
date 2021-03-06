import { ConnectionOptions } from 'typeorm';
import { join as joinPath } from 'path';

export const connectionOptions = (): ConnectionOptions => {
  const defaultConnectionOption: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number.parseInt(process.env.DATABASE_PORT, 10),
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: process.env.DATABASE_DROPSCHEMA === 'true',
    logging: true,
    entities: [joinPath(process.cwd(), '/build/models/*.js')],
    subscribers: [joinPath(process.cwd(), '/build/subscribers/*.js')],
    migrations: [joinPath(process.cwd(), '/build/migrations/*.js')],
    cli: {
      entitiesDir: '/src/models',
      migrationsDir: 'src/migrations',
      subscribersDir: '/src/subscribers'
    }
  };
  switch (process.env.NODE_ENV) {
    case 'production':
      return { ...defaultConnectionOption, logging: false, synchronize: false };

    case 'test':
      return {
        ...defaultConnectionOption,
        logging: false,
        dropSchema: true,
        synchronize: true,
        entities: [__dirname + '/../models/*.{js,ts}']
      };

    default:
      return defaultConnectionOption;
  }
};
