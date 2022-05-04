import { ServicesLoader } from './libs/services/ServicesLoader';
import 'reflect-metadata';
import dotenv from 'dotenv';
import fs from 'fs';


export default async () => {
  if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
  } 

  await ServicesLoader.load();
};
