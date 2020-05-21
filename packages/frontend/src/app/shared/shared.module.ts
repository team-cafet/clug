import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { DeleteDialogComponent } from './generic/delete-dialog/delete-dialog.component';

@NgModule({
  imports: [ CommonModule, AppMaterialModule ],
  declarations: [ DeleteDialogComponent ],
  exports: [ DeleteDialogComponent ]
})
export class SharedModule {}
export { DeleteDialogComponent };
