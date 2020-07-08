import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ClubService } from 'src/app/core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeleteDialogComponent } from '../../generic/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { NotificationComponent } from '../../generic/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: [ './club-form.component.scss' ]
})
export class ClubFormComponent implements OnInit {
  @Input() club: Club;
  @Output() saved = new EventEmitter<Club>();

  clubForm: FormGroup;

  constructor(
    private readonly memberSrv: ClubService,
    private readonly clubSrv: ClubService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.club) {
      throw new Error('ClubFormComponent: club undefined');
    }

    this.clubForm = this.fb.group({
      designation: [ this.club.designation, [ Validators.required, Validators.minLength(3) ] ],
      description: [ this.club.description, [ Validators.maxLength(255) ] ]
    });
  }

  async save() {
    try {
      if (this.club.id) {
        this.club = await this.clubSrv.saveOne({
          id: this.club.id,
          ...this.clubForm.value
        });
      } else {
        this.club = await this.clubSrv.addOne(this.clubForm.value);
      }

      this.saved.emit(this.club);
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
        this.clubSrv.delete(this.club)
          .catch(err => console.error(err))
          .finally(() => {
            this.location.back();
          });
      }
    });
  }
}
