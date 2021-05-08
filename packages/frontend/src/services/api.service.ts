import axios from 'axios';
import { getToken } from './auth.service';

const API_URL = '/api/';

/**
 * Define all possible HTTP METHODS
 */
export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * General purpose function to make a request on the api
 * @param {*} url
 * @param {*} method
 * @param {*} body
 */
export async function makeApiRequest(
  url: string,
  method: METHODS,
  body: any = undefined,
  options?: any
) {
  const instance = axios.create({ baseURL: API_URL });

  // The following code set the authoritzazion header
  const token = getToken();
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  if (options?.formdata) {
    instance.defaults.headers['Content-Type'] = 'multipart/form-data';
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    body = formData;
  }

  switch (method) {
    case METHODS.GET:
      return instance.get(url, { params: body });

    case METHODS.POST:
      return instance.post(url, body);

    case METHODS.PUT:
      return instance.put(url, body);

    case METHODS.PATCH:
      return instance.patch(url, body);

    case METHODS.DELETE:
      return instance.delete(url);

    default:
      break;
  }
}

/**
 * Simply request with GET method
 * @param {*} url
 */
export function GET(url: string, body?: any) {
  return makeApiRequest(url, METHODS.GET, body);
}

/**
 * Simply request with POST method
 * @param {*} url
 * @param {*} body
 */
export function POST(url: string, body: any, options?: any) {
  return makeApiRequest(url, METHODS.POST, body, options);
}

/**
 * Simply request with PUT method
 * @param {*} url
 * @param {*} body
 */
export function PUT(url: string, body: any, options?: any) {
  return makeApiRequest(url, METHODS.PUT, body, options);
}

/**
 * Simply request with PATCH method
 * @param {*} url
 * @param {*} body
 */
export function PATCH(url: string, body: any) {
  return makeApiRequest(url, METHODS.PATCH, body);
}

/**
 * Simply request with DELETE method
 * @param {*} url
 */
export function DELETE(url: string) {
  return makeApiRequest(url, METHODS.DELETE);
}

/**
 * Generic class for REST API resources
 */
export class APIResource {
  constructor(private resourceURL: string) {}

  /**
   * Get all resources records
   */
  getAll() {
    return GET(this.resourceURL);
  }

  /**
   * Get a specific resource record
   * @param {*} id
   */
  getByID(id: number) {
    return GET(`${this.resourceURL}/${id}`);
  }

  /**
   * Add a resource record
   * @param {*} body
   */
  add(body: any) {
    return POST(this.resourceURL, body);
  }

  /**
   * Update a resource record
   * @param {*} id
   * @param {*} body
   */
  update(id: number, body: any) {
    return PUT(`${this.resourceURL}/${id}`, body);
  }

  /**
   * 
   * @param id 
   * @param body 
   * @returns 
   */
  updateWithFormData(id: number, body: any) {
    return PUT(`${this.resourceURL}/${id}`, body, { formdata: true });
  }

  /**
   * Delete a resource record
   * @param {*} id
   */
  delete(id: number) {
    return DELETE(`${this.resourceURL}/${id}`);
  }
}
