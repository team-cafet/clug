import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AppMaterialModule } from '.././app-material.module';



@NgModule({
  declarations: [DeleteDialogComponent],
  imports: [
    CommonModule,
    AppMaterialModule
  ]
})
export class MemberModule { }
