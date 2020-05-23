import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RESTService } from './rest.service';

@Injectable()
export class LevelService extends RESTService {
  constructor(apiService: ApiService) {
    super('/level', apiService);
  }
}
