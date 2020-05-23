import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RESTService } from './rest.service';

@Injectable()
export class MemberService extends RESTService {
  constructor(apiService: ApiService) {
    super('member/', apiService);
  }
}
