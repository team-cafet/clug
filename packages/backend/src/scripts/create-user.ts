import { loadORM } from '../util/loadorm';
import { loadEnv } from '../util/loadenv';
import { DeepPartial, getRepository } from 'typeorm';
import { User } from '../models/User';

export const createUser = async (data: DeepPartial<User>): Promise<User> => {
  loadEnv();
  await loadORM();
  const userRepo = getRepository(User);
  const userData = userRepo.create([data]);
  return userData[0].save();
};
