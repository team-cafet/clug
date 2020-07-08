import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { LevelService } from 'src/app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../generic/delete-dialog/delete-dialog.component';
import { Location } from '@angular/common';
import { NotificationComponent } from '../../generic/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-level-form',
  templateUrl: './level-form.component.html',
  styleUrls: [ './level-form.component.scss' ]
})
export class LevelFormComponent implements OnInit {
  @Input() level: Level;
  @Output() saved = new EventEmitter<Level>();

  levelForm: FormGroup;

  constructor(
    private readonly levelSrv: LevelService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.level) {
      throw new Error('LevelFormComponent: level undefined');
    }

    this.levelForm = this.fb.group({
      name: [ this.level.name, [ Validators.required, Validators.minLength(3) ] ],
      description: [ this.level.description, [ Validators.maxLength(255) ] ]
    });
  }

  async save() {
    try {
      if (this.level.id) {
        this.level = await this.levelSrv.saveOne({ id: this.level.id, ...this.levelForm.value });
      } else {
        this.level = await this.levelSrv.addOne(this.levelForm.value);
      }

      this.saved.emit(this.levelForm.value);

    } catch (error) {
      console.error(error);
      NotificationComponent.openNotification(this.snackbar, error, 5);
    }
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.levelSrv.delete(this.level)
          .catch(err => console.error(err))
          .finally(() => {
            this.location.back();
          });
      }
    });
  }
}
