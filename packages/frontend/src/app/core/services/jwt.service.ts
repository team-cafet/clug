import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  getToken(): string {
    return window.localStorage.getItem('jwtToken');
  }

  saveToken(token: string) {
    window.localStorage.setItem('jwtToken', token);
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }
}
