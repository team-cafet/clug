import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  credentials = { email: '', password: '' };
  invalidCredentials: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);

  matcher = new MyErrorStateMatcher();


  async login(): Promise<void> {
    try {
      await this.userService.login(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      console.error(error);
      this.invalidCredentials = true;
    }
  }
}
