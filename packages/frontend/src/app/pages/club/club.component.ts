import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Club,ClubService
} from 'src/app/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/member/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  clubs: Club[] = [];
  tableDataSource = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'designation',
    'description',
  ];

constructor(private clubSrv: ClubService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchClubList();
  }

  public addClub() {
    console.log(`Add club`);
    // TODO
  }

  public async fetchClubList(): Promise<void>{
    return this.clubSrv.getAllClubs().then((reqClubs) => {
      this.clubs = reqClubs;
      this.tableDataSource.data = this.clubs;
    })
    .catch((e) => {
      console.error(e);
    });
  }

  public deleteClub(club: Club) {
    this.openDialog(club);
  }

  private openDialog(club: Club): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: club,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchClubList();
      }
    });
  }

}
