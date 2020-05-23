import { NgModule } from '@angular/core';
import { DeleteDialogComponent } from './generic/delete-dialog/delete-dialog.component';
import { MemberFormComponent } from './forms/member-form/member-form.component';
import { AppCommonModule } from '../app-common.module';
import { ClubFormComponent } from './forms/club-form/club-form.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { RestDataTableComponent } from './generic/rest-data-table/rest-data-table.component';
import { RestViewComponent } from './generic/rest-view/rest-view.component';

@NgModule({
  imports: [ AppCommonModule ],
  declarations: [
    // GENERIC
    DeleteDialogComponent,
    RestDataTableComponent,
    RestViewComponent,

    // FORMS
    MemberFormComponent,
    ClubFormComponent,
    LoginFormComponent
  ],
  exports: [
    // GENERIC
    DeleteDialogComponent,
    RestDataTableComponent,
    RestViewComponent,

    // FORMS
    MemberFormComponent,
    ClubFormComponent,
    LoginFormComponent
  ]
})
export class SharedModule {}
export { DeleteDialogComponent, MemberFormComponent, ClubFormComponent, RestDataTableComponent, RestViewComponent };
