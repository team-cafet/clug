import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserModule } from '../user/user.module';
import { AppMaterialModule } from '../app-material.module';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberComponent } from './member/member.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [HomeComponent, NotFoundComponent, MemberComponent, MemberDetailsComponent, LoginComponent],
  imports: [CommonModule, UserModule, AppMaterialModule, RouterModule, FormsModule]
})
export class PagesModule {}
