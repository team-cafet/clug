import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { JwtService } from './services/jwt.service';
import { MemberService } from './services/member.service';
import { ClubService } from './services/club.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService, UserService, JwtService, MemberService, ClubService]
})
export class CoreModule {}

export * from './models/index';
export * from './services/index';
export * from './guards/index';
