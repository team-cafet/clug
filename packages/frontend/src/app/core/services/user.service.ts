import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    try {
      const req = await this.apiService.post('/auth/login', {
        email,
        password
      });
      console.log(req);
      this.jwtService.saveToken(req.token);

      return req;
    } catch (error) {
      throw new Error('Invalid Credentials');
    }
  }
}
