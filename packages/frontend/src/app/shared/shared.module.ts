import { NgModule } from '@angular/core';
import { DeleteDialogComponent } from './generic/delete-dialog/delete-dialog.component';
import { MemberFormComponent } from './forms/member-form/member-form.component';
import { AppCommonModule } from '../app-common.module';
import { ClubFormComponent } from './forms/club-form/club-form.component';

@NgModule({
  imports: [ AppCommonModule ],
  declarations: [
    // GENERIC
    DeleteDialogComponent,

    // FORMS
    MemberFormComponent,
    ClubFormComponent
  ],
  exports: [
    // GENERIC
    DeleteDialogComponent,

    // FORMS
    MemberFormComponent,
    ClubFormComponent
  ]
})
export class SharedModule {}
export { DeleteDialogComponent, MemberFormComponent, ClubFormComponent };
