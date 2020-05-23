import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemberAddComponent } from './member/member-add/member-add.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberComponent } from './member/member.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClubComponent } from './club/club.component';
import { AddClubComponent } from './club/add-club/add-club.component';
import { ClubDetailsComponent } from './club/club-details/club-details.component';
import { SharedModule } from '../shared/shared.module';
import { AppCommonModule } from '../app-common.module';

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
    ClubDetailsComponent
  ],
  imports: [
    AppCommonModule,
    SharedModule
  ]
})
export class PagesModule {}
