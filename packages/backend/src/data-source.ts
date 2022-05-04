import { DataSource } from 'typeorm';
import { connectionOptions } from './config/database';

export const AppDataSource = new DataSource(connectionOptions());
