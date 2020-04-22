import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Club } from '../models/club.model';

const API_CLUB = 'club/';

@Injectable()
export class ClubService {
  constructor(private apiService: ApiService) {}

  async getAllClubs(filter?) {
    return await this.apiService.get(API_CLUB);
  }

  async getOneById(id) {
    return await this.apiService.get(`${API_CLUB}${id}`);
  }

  async saveOne(club: Club) {
    if (!club.id) {
      throw new Error('Can not save a club without his id');
    }

    return await this.apiService.put(`${API_CLUB}${club.id}`, club);
  }

  async addOne(club: Club) {
    return await this.apiService.post(`${API_CLUB}`, club);
  }

  async delete(club: Club) {
    return await this.apiService.delete(`${API_CLUB}${club.id}`);
  }
}
