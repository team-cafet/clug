import { Component } from '@angular/core';
import { JwtService } from './core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  constructor(
    private readonly jwtSrv: JwtService,
    private readonly router: Router
  ) { }

  ngOnDestroy(): void {
    //
  }
}
