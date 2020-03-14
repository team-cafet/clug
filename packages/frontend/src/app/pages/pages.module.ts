import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserModule } from '../user/user.module';
import { AppMaterialModule } from '../app-material.module';
import { MemberComponent } from './member/member.component';

@NgModule({
  declarations: [HomeComponent, NotFoundComponent, MemberComponent],
  imports: [CommonModule, UserModule, AppMaterialModule]
})
export class PagesModule {}
