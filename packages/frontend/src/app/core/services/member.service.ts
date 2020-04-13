import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Member } from '../models';

const API_MEMBER = 'member/';

@Injectable()
export class MemberService {
  constructor(private apiService: ApiService) {}

  async getAllMember(filter?) {
    return await this.apiService.get(API_MEMBER);
  }

  async getOneById(id) {
    return await this.apiService.get(`${API_MEMBER}${id}`);
  }

  async saveOne(member: Member) {
    if (!member.id) {
      throw new Error('Can not save a member without his id');
    }

    return await this.apiService.put(`${API_MEMBER}${member.id}`, member);
  }

  async delete(member: Member) {
    try {
      const req = await this.apiService.delete(`${API_MEMBER}${member.id}`);
    } catch (error) {
      throw new Error('Error during member deletion');
    }
  }
}
