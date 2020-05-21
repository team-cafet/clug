import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
  constructor(private readonly api: ApiService) {}

  fetchMember() {
    this.api
      .get('member')
      .catch(err => console.error(err));
  }

}
