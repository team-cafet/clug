import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  credentials = { email: '', password: '' };

  invalidCredential = false;

  constructor(private userService: UserService) {}

  async login(loginForm: NgForm) {
    try{
      await this.userService.login(this.credentials.email, this.credentials.password);
    } catch(error) {
      console.error(error);
      this.invalidCredential = true
    }
  }

  ngOnInit(): void {}
}
