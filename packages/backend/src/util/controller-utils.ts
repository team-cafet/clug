import { Request } from 'express';
import { User } from '../models/User';
import { getRepository } from 'typeorm';
import { Organisation } from '../models/Organisation';

/**
 * Return the current organisation of the user from a request
 * @param req
 */
export const getCurrentOrgFromUserInRequest = async (
  req: Request
): Promise<Organisation> => {
  const userRepo = getRepository(User);
  const currentUser = await userRepo.findOne(req.user.user.id);
  return currentUser.getUserOrganisation();
};
