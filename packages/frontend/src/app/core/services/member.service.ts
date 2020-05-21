import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Member } from '../models';

const API_MEMBER = 'member/';

@Injectable()
export class MemberService {
  constructor(private readonly apiService: ApiService) {}

  async getAllMember() {
    return this.apiService.get(API_MEMBER);
  }

  async getOneById(id) {
    return this.apiService.get(`${API_MEMBER}${id}`);
  }

  async saveOne(member: Member) {
    if (!member.id) {
      throw new Error('Can not save a member without his id');
    }

    return this.apiService.put(`${API_MEMBER}${member.id}`, member);
  }

  async addOne(member: Member) {
    return this.apiService.post(`${API_MEMBER}`, member);
  }

  async delete(member: Member) {
    return this.apiService.delete(`${API_MEMBER}${member.id}`);
  }
}
