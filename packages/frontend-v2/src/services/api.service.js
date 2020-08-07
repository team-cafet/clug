// https://github.com/axios/axios
import axios from 'axios';
import { getToken } from './auth.service';

const API_URL = '/api/';

/**
 * Define all possible HTTP METHODS
 */
export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

/**
 * General purpose function to make a request on the api
 * @param {*} url 
 * @param {*} method 
 * @param {*} body 
 */
export async function makeApiRequest(url, method, body = undefined) {
  // https://github.com/axios/axios, chapitre Config Defaults
  const instance = axios.create({ baseURL: API_URL });

  // The following code set the authoritzazion header
  const token = getToken();
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  switch (method) {
    case METHODS.GET:
      return instance.get(url, {params: body});

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
export function GET(url, body) {
    return makeApiRequest(url, METHODS.GET, body);
}

/**
 * Simply request with POST method
 * @param {*} url 
 * @param {*} body 
 */
export function POST(url, body) {
    return makeApiRequest(url, METHODS.POST, body);
}

/**
 * Simply request with PUT method
 * @param {*} url 
 * @param {*} body 
 */
export function PUT(url, body) {
    return makeApiRequest(url, METHODS.PUT, body);
}

/**
 * Simply request with PATCH method
 * @param {*} url 
 * @param {*} body 
 */
export function PATCH(url, body) {
    return makeApiRequest(url, METHODS.PATCH, body);
}

/**
 * Simply request with DELETE method
 * @param {*} url 
 */
export function DELETE(url) {
    return makeApiRequest(url, METHODS.DELETE);
}

/**
 * Generic class for REST API resources
 */
export class APIResource {
    constructor(resourceURL) {
        this.resourceURL = resourceURL;
    }

    /**
     * Get all resources records 
     */
    getAll() {
        return GET(this.resourceURL)
    }
    
    /**
     * Get a specific resource record
     * @param {*} id 
     */
    getByID(id) {
        return GET(`${this.resourceURL}/${id}`)
    }

    /**
     * Add a resource record
     * @param {*} body 
     */
    add(body) {
        return POST(this.resourceURL, body)
    }

    /**
     * Update a resource record
     * @param {*} id 
     * @param {*} body 
     */
    update(id, body) {
        return PATCH(`${this.resourceURL}/${id}`, body)
    }

    /**
     * Delete a resource record
     * @param {*} id 
     */
    delete(id) {
        return DELETE(`${this.resourceURL}/${id}`)
    }
}