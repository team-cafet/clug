import { ConnectionOptions } from 'typeorm';

export const connectionOptions = ():ConnectionOptions => {
  
  const defaultConnectionOption: ConnectionOptions = {
    type: 'postgres',
    url:
      process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/db',
    synchronize: true,
    logging: true
  };

  switch (process.env.NODE_ENV) {
    case 'production':
      return { ...defaultConnectionOption, logging: false, synchronize: false };

    case 'test':
      return {
        ...defaultConnectionOption,
        logging: false,
        dropSchema: true,
        entities: [__dirname + '/../models/*.{js,ts}']
      };

    default:
      return defaultConnectionOption;
  }
};
