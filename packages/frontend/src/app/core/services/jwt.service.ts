import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  private static readonly TOKEN_LOCATION = 'JWT_TOKEN';
  private static readonly MAX_TOKEN_AGE = 60 * 60 * 24 * 200; // sec

  getToken(): string {
    try {
      return JSON.parse(window.localStorage.getItem(JwtService.TOKEN_LOCATION))
        .token;
    } catch (err) {
      return undefined;
    }
  }

  saveToken(token: string) {
    window.localStorage.setItem(
      JwtService.TOKEN_LOCATION,
      JSON.stringify({ token, timestamp: Date.now() })
    );
  }

  destroyToken() {
    window.localStorage.removeItem(JwtService.TOKEN_LOCATION);
  }

  isTokenValid() {
    const data = JSON.parse(
      window.localStorage.getItem(JwtService.TOKEN_LOCATION)
    );
    if (
      !data ||
      !data.timestamp ||
      Date.now() - data.timestamp > JwtService.MAX_TOKEN_AGE * 1000
    ) {
      return false;
    }
    return true;
  }
}
