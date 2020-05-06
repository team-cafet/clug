import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Member } from './node_modules/src/app/core/models';
import { MemberService } from './node_modules/src/app/core/services';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
// TODO: It is better to have only one dynamic delete dialog or one by entity ?
export class DeleteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private memberSrv: MemberService
  ) {}
  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async deleteMember(): Promise<void> {
    this.memberSrv.delete(this.data).then((reqMembers) => {
      this.dialogRef.close('member deleted');
    })
    .catch((e) => {
      console.error(e);
    });
  }
}
