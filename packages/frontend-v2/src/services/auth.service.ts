import { POST } from './api.service';

const LS_USER_CONFIG = 'LS_USER_CONFIG';
const LS_TOKEN = 'LS_TOKEN';

/**
 *
 * @param {*} username
 * @param {*} password
 */
export async function login(username: string, password: string) {
  try {
    const result: any = await POST('auth/login', { email: username, password });
    setToken(result.data.token.token);
    setUserConfig(UserConfig(result.data.groups, result.data.user));
    return result;
  } catch (error) {
    throw new Error('Password incorrect');
  }
}

/**
 *
 * @param {*} group
 * @param {*} user
 */
const UserConfig = (group: any, user: any) => {
  return { groups: group, user };
};

/**
 *
 * @param {*} config
 */
function setUserConfig(config: any) {
  if (!config) {
    return;
  }

  localStorage.setItem(LS_USER_CONFIG, JSON.stringify(config));
}

/**
 *
 * @param {*} key
 * @param {*} value
 */
export const updateUserConfig = (key: string, value: any) => {
  const currConfig = getUserConfig();
  currConfig[key] = value;

  setUserConfig(currConfig);
};

/**
 *
 */
export function getUserConfig() {
  const userConfig = localStorage.getItem(LS_USER_CONFIG);

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
    return;
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
