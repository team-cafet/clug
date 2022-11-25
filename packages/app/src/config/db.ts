import { DataSourceOptions } from 'typeorm';

type dbConfig = {
  mainDatabase: DataSourceOptions;
};

export default (): dbConfig => ({
  mainDatabase: {
    type: 'postgres',
    url:
      process.env.DATABASE_URL ??
      'postgres://postgres:.Clug-123@localhost:5432/clug-db',
    entities: ['dist/src/**/*.model.js'],
    migrations: ['dist/src/db/migrations/*{.ts,.js}'],
  },
});
