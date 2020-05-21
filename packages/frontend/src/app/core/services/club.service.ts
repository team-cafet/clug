import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Club } from '../models/club.model';

const API_CLUB = 'club/';

@Injectable()
export class ClubService {
  constructor(private readonly apiService: ApiService) {}

  async getAllClubs() {
    return this.apiService.get(API_CLUB);
  }

  async getOneById(id) {
    return this.apiService.get(`${API_CLUB}${id}`);
  }

  async saveOne(club: Club) {
    if (!club.id) {
      throw new Error('Can not save a club without his id');
    }

    return this.apiService.put(`${API_CLUB}${club.id}`, club);
  }

  async addOne(club: Club) {
    return this.apiService.post(`${API_CLUB}`, club);
  }

  async delete(club: Club) {
    return this.apiService.delete(`${API_CLUB}${club.id}`);
  }
}
