import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService
  ) { }

  async canActivate(): Promise<boolean> {
    if (!this.jwtService.isTokenValid()) {
      await this.router.navigate([ 'login' ]);
      return false;
    }
    return true;
  }
}
