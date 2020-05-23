import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MemberAddComponent } from './pages/member/member-add/member-add.component';
import { MemberDetailsComponent } from './pages/member/member-details/member-details.component';
import { MemberComponent } from './pages/member/member.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ClubAddComponent } from './pages/club/club-add/club-add.component';
import { ClubComponent } from './pages/club/club.component';
import { ClubDetailsComponent } from './pages/club/club-details/club-details.component';
import { AppAdminComponent } from './app-admin.component';
import { LevelComponent } from './pages/level/level.component';
import { LevelAddComponent } from './pages/level/level-add/level-add.component';
import { LevelDetailsComponent } from './pages/level/level-details/level-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: AppAdminComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'member',
        component: MemberComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'member/add',
        component: MemberAddComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'member/:id',
        component: MemberDetailsComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'club',
        component: ClubComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'club/add',
        component: ClubAddComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'club/:id',
        component: ClubDetailsComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'level',
        component: LevelComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'level/add',
        component: LevelAddComponent,
        canActivate: [ AuthGuard ]
      },
      {
        path: 'level/:id',
        component: LevelDetailsComponent,
        canActivate: [ AuthGuard ]
      }

    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
