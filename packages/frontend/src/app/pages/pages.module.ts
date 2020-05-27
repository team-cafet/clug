import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemberAddComponent } from './member/member-add/member-add.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberComponent } from './member/member.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClubComponent } from './club/club.component';
import { ClubAddComponent } from './club/club-add/club-add.component';
import { ClubDetailsComponent } from './club/club-details/club-details.component';
import { SharedModule } from '../shared/shared.module';
import { AppCommonModule } from '../app-common.module';
import { LevelAddComponent } from './level/level-add/level-add.component';
import { LevelDetailsComponent } from './level/level-details/level-details.component';
import { LevelComponent } from './level/level.component';

@NgModule({
  declarations: [
    HomeComponent,
    NotFoundComponent,
    MemberComponent,
    MemberDetailsComponent,
    MemberAddComponent,
    LoginComponent,
    ClubComponent,
    ClubAddComponent,
    ClubDetailsComponent,
    LevelAddComponent,
    LevelDetailsComponent,
    LevelComponent
  ],
  imports: [
    AppCommonModule,
    SharedModule
  ]
})
export class PagesModule {}
