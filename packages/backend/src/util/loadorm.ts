import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions,
  Connection,
  getConnection,
} from 'typeorm';
import { connectionOptions } from '../config/database';

export const loadORM = async (
  options?: null | ConnectionOptions
): Promise<Connection> => {
  if (!options) {
    options = connectionOptions();
  }

  let currentConnection = null;
  try {
    currentConnection = await getConnection(options.name);
    return currentConnection;
  } catch (err) {}

  let defaultConnectionOption;
  try {
    defaultConnectionOption = await getConnectionOptions();
  } catch (error) {
    defaultConnectionOption = null;
  }

  currentConnection = await createConnection(
    Object.assign(defaultConnectionOption ?? {}, options)
  );

  return currentConnection;
};
