import { POST } from './api.service';

const LS_USER_CONFIG = 'LS_USER_CONFIG';
const LS_TOKEN = 'LS_TOKEN';

/**
 *
 * @param {*} email
 * @param {*} password
 */
export async function login(email, password) {
  try {
    const result = await POST('auth/login', { email, password });
    setToken(result.data.token.token);
    setUserConfig(UserConfig(result.data.groups, result.data.user, result.data?.defaultEditionID));
    return result;
  } catch (error) {
    throw new Error("Password incorrect");
  }
}

/**
 * 
 * @param {*} signInData 
 * @returns
 */
export async function signIn(signInData) {
  try {
    const result = await POST('auth/signin', signInData);
    return result
  }catch(error) {
    throw new Error(`Ooops ! Something went wrong... -> ${error}`);
  }
}

/**
 *
 * @param {*} groups
 * @param {*} editionID
 * @param {*} user
 */
const UserConfig = (groups, user, editionID) => {
  return { groups, user, defaultEditionID: editionID };
};

/**
 *
 * @param {*} config
 */
function setUserConfig(config) {
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
export const updateUserConfig = (key, value)  => {
  const currConfig = getUserConfig();
  currConfig[key] = value;

  setUserConfig(currConfig);
}

/**
 *
 */
export function getUserConfig() {
  return JSON.parse(localStorage.getItem(LS_USER_CONFIG));
}

/**
 *
 * @param {*} token
 */
function setToken(token) {
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