import { connectionOptions as connectionOptionsFnc } from './database';

const connectionOptions = connectionOptionsFnc();
console.log(connectionOptions);
export = connectionOptions;
