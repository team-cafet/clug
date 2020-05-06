import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { UserModule } from '../user/user.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemberAddComponent } from './member/member-add/member-add.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberComponent } from './member/member.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClubComponent } from './club/club.component';
import { AddClubComponent } from './club/add-club/add-club.component';

@NgModule({
  declarations: [
    HomeComponent,
    NotFoundComponent,
    MemberComponent,
    MemberDetailsComponent,
    MemberAddComponent,
    LoginComponent,
    ClubComponent,
    AddClubComponent,
  ],
  imports: [
    CommonModule,
    UserModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
  ],
})
export class PagesModule {}
