import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MemberAddComponent } from './pages/member/member-add/member-add.component';
import { MemberDetailsComponent } from './pages/member/member-details/member-details.component';
import { MemberComponent } from './pages/member/member.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ClubComponent } from './pages/club/club/club.component';
import { AddClubComponent } from './pages/club/add-club/add-club.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },

  {
    path: 'member',
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'member/add',
    component: MemberAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'member/:id',
    component: MemberDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'club',
    component: ClubComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'club/add',
    component: AddClubComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
