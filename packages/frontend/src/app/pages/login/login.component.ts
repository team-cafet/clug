import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private api: ApiService) {}

  fetchMember($event) {
    this.api
      .get('member')
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  ngOnInit(): void {}
}
