import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions,
  Connection
} from 'typeorm';
import { connectionOptions } from '../config/database';

export const loadORM = async (
  options: ConnectionOptions = connectionOptions()
): Promise<Connection> => {
  try {
    const defaultConnectionOption = await getConnectionOptions();

    return await createConnection(
      Object.assign(defaultConnectionOption, options)
    );
  } catch (err) {
    return await createConnection(Object.assign({}, options));
  }
};
