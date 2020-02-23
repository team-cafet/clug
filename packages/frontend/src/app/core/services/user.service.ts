import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService) {}

  async login(email: string, password: string) {
    try {
      const req = await this.apiService.post('/auth/login', {
        email,
        password
      });

      console.log(req);

      return req;
    } catch (error) {
      throw new Error('Invalid Credentials');
    }

  }
}
