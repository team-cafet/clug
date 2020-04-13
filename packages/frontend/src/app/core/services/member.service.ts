import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

const API_MEMBER = '/member/';

@Injectable()
export class MemberService {
  constructor(private apiService: ApiService) {}

  async getAllMember(filter?) {
      return await this.apiService.get(API_MEMBER);
  }

  async getOneById(id) {
      return await this.apiService.get(`${API_MEMBER}${id}`);
  }


}
