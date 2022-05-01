import { DataSourceOptions } from 'typeorm';
import { join as joinPath } from 'path';

export const connectionOptions = (): DataSourceOptions => {
  const defaultConnectionOption: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number.parseInt(process.env.DATABASE_PORT, 10),
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: process.env.DATABASE_DROPSCHEMA === 'true',
    logging: ['error', 'warn', 'query'],
    entities: [joinPath(process.cwd(), '/build/models/*.js')],
    subscribers: [joinPath(process.cwd(), '/build/subscribers/*.js')],
    migrations: [joinPath(process.cwd(), '/build/migrations/*.js')],
    // TODO: Check if below are needed
    // cli: {
    // entitiesDir: '/src/models',
    // migrationsDir: 'src/migrations',
    // subscribersDir: '/src/subscribers',
    // },
  };
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        ...defaultConnectionOption,
        logging: ['error'],
        synchronize: false,
      };

    case 'test':
      return {
        type: 'sqljs',
        database: new Uint8Array(),
        location: 'database',
        logging: false,
        synchronize: true,
        entities: ['build/models/**/*.js'],
        dropSchema: true,
      };

    default:
      return defaultConnectionOption;
  }
};
