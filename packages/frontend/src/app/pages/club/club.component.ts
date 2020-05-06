import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Club,ClubService
} from 'src/app/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/member/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { DeleteClubDialogComponent } from './delete-club/delete-club.component';

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
    'action'
  ];

constructor(private clubSrv: ClubService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.fetchClubList();
  }

  public addClub() {
    console.log(`Add club`);
    // TODO
  }
  public showDetails(idClub: number){
    this.router.navigate(['/club', idClub]);
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
    const dialogRef = this.dialog.open(DeleteClubDialogComponent, {
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
