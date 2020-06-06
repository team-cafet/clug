import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RESTService } from './rest.service';

@Injectable()
export class AddressService extends RESTService {
  constructor(apiService: ApiService) {
    super('address/', apiService);
  }
}
