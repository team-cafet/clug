import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app-admin.component.html',
  styleUrls: [ './app-admin.component.scss' ]
})
export class AppAdminComponent {
  isMobileMenuOpen = false;

  constructor(private readonly router: Router) {
    router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
    });
  }

  openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
