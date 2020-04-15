import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MemberDetailsComponent } from './pages/member/member-details/member-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberComponent } from './pages/member/member.component';
import { AuthGuard } from './core/guards';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },

  {
    path: 'member',
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'member/:id',
    component: MemberDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
