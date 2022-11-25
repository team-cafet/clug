import { DataSource } from 'typeorm';
import db from './src/config/db';

export default new DataSource({
  ...db().mainDatabase,
});
