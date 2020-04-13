import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserModule } from '../user/user.module';
import { AppMaterialModule } from '../app-material.module';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberComponent } from './member/member.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent, NotFoundComponent, MemberComponent, MemberDetailsComponent],
  imports: [CommonModule, UserModule, AppMaterialModule, RouterModule]
})
export class PagesModule {}
