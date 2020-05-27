import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RESTService } from './rest.service';

@Injectable()
export class ClubService extends RESTService {
  constructor(apiService: ApiService) {
    super('club/', apiService);
  }
}
