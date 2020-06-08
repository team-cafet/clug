import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import {
  StatisticService,
  AddressService,
  ApiService,
  UserService,
  JwtService,
  MemberService,
  ClubService,
  LevelService
} from './services';

@NgModule({
  declarations: [],
  imports: [ CommonModule ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    UserService,
    JwtService,
    MemberService,
    ClubService,
    LevelService,
    StatisticService,
    AddressService
  ]
})
export class CoreModule {}

export * from './models/index';
export * from './services/index';
export * from './guards/index';
export * from './classes/index';
export * from './functions/index';
