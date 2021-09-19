import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

export const loadEnv = () => {
  if (fs.existsSync('.env')) {
    logger.info('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
  } 
};
