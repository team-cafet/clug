import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export const loadEnv = () => {
  if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path:  '.env'});
  } else {
    logger.debug(
      'Using .env.example file to supply config environment variables'
    );
    dotenv.config({ path: '.env.example' }); // you can delete this after you create your own .env file!
  }
};