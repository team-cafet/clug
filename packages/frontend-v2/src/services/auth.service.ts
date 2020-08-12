import { POST } from './api.service';
import { IUser } from '../libs/interfaces/user.interface';

const LS_USER_INFO = 'LS_USER_INFO';
const LS_TOKEN = 'LS_TOKEN';

/**
 * Following inteface must be the same as IUserInfo in backend
 */
interface IUserInfo {
  id: number;
  username:string;
  organisation: {
    id: number;
  } | null;
  group: {
    id: number
  };
}

/**
 *
 * @param {*} username
 * @param {*} password
 */
export async function login(username: string, password: string) {
  const result = await POST('auth/login', { username, password });
  const data: {user:IUserInfo, token:string} = result?.data;
  setToken(data.token);
  setUserInfo(data.user);
  return result;
}

/**
 *
 * @param {*} info
 */
function setUserInfo(info: IUserInfo) {
  if (!info) {
    return;
  }

  localStorage.setItem(LS_USER_INFO, JSON.stringify(info));
}

/**
 *
 */
export function getUserInfo(): IUserInfo | null {
  const userConfig = localStorage.getItem(LS_USER_INFO);

  if (!userConfig) {
    return null;
  }

  return JSON.parse(userConfig);
}

/**
 *
 * @param {*} token
 */
function setToken(token: string) {
  if (!token) {
    throw Error('no_token_defined');
  }
  localStorage.setItem(LS_TOKEN, token);
}

/**
 *
 */
export function getToken() {
  return localStorage.getItem(LS_TOKEN);
}

/**
 *
 */
export function logout() {
  localStorage.clear();
}
