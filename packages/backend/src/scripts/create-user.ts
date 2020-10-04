import { loadORM } from '../util/loadorm';
import { loadEnv } from '../util/loadenv';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../models/User';

export const createUser = async (data: any): Promise<any> => {
  loadEnv();
  try {
    await loadORM();
    return await getRepository(User).create(data);
  } catch (error) {
    console.error(error);
  }

  getConnection().close();
};
