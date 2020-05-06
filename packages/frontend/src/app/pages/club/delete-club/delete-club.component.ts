import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Member } from 'src/app/core/models';
import { MemberService, ClubService } from 'src/app/core/services';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-club.component.html',
  styleUrls: ['./delete-club.component.scss'],
})
// TODO: It is better to have only one dynamic delete dialog or one by entity ?
export class DeleteClubDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteClubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private clubSrv: ClubService
  ) {}
  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async deleteClub(): Promise<void> {
    this.clubSrv.delete(this.data).then((reqClub) => {
      this.dialogRef.close('club deleted');
    })
    .catch((e) => {
      console.error(e);
    });
  }
}
