import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MemberDetailsComponent } from './pages/member-details/member-details.component'
import { NotFoundComponent } from './pages/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'member', component: MemberDetailsComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
