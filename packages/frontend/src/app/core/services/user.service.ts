import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  async login(username: string, password: string) {
    let req = await this.apiService.post('/auth/login', { username, password });

    console.log(req);

    return req;
  }
}
