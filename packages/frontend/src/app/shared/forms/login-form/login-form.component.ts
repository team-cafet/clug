import { Component } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form?.submitted;
    return Boolean(control?.invalid &&
      (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: [ './login-form.component.scss' ]
})
export class LoginFormComponent {
  credentials = { email: '', password: '' };
  invalidCredentials: boolean;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private readonly userService: UserService, private readonly router: Router) {}

  async login(): Promise<void> {
    try {
      await this.userService.login(
        this.emailFormControl.value,
        this.passwordFormControl.value
      );
      await this.router.navigate([ 'app/member' ]); // TODO: Change depending on the general member view's url
    } catch (error) {
      this.invalidCredentials = true;
    }
  }
}