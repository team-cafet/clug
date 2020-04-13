import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  opened: boolean;

  constructor(location: Location) {}

  ngOnInit() {
    console.log(`The location ${location.pathname}`);
    if (location.pathname === '/') {
      this.opened = false;
      console.log('im on base page')
    } else {
      this.opened = true;
    }
  }
}
