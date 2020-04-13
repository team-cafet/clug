import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Member } from '../models';

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

  async delete(member: Member) {
    try {
      const req = await this.apiService.delete(`${API_MEMBER}${member.id}`);
    } catch (error) {
      throw new Error('Error during member deletion');
    }
  }
}
