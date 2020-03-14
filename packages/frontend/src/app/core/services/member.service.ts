import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

const API_MEMBER = '/member/';

@Injectable()
export class MemberService {
  constructor(private apiService: ApiService) {}

  async getAllMember(filter?) {
    try {
      const req = await this.apiService.get(API_MEMBER);
      console.log(req);
      return req;
    } catch (error) {
      throw new Error('Error during fetching member');
    }
  }
}
