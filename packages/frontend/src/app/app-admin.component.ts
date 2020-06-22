import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app-admin.component.html',
  styleUrls: [ './app-admin.component.scss' ]
})
export class AppAdminComponent {
  isMobileMenuOpen = false;

  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService

  ) {
    router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
    });
  }

  openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.jwtService.destroyToken();
    this.router.navigate([ '/login' ]).finally(() => {
      //
    });
  }
}
