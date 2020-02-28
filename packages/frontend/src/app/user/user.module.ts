import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [CommonModule, FormsModule, AppMaterialModule],
  exports: [LoginFormComponent]
})
export class UserModule {}
