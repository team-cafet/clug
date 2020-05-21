import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Club, ClubService } from 'src/app/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../shared/shared.module';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: [ './club.component.scss' ]
})
export class ClubComponent implements OnInit {
  clubs: Club[] = [];
  tableDataSource = new MatTableDataSource([]);
  displayedColumns: string[] = [ 'designation', 'description', 'action' ];

  constructor(
    private readonly clubSrv: ClubService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchClubList().finally(() => {
      // TODO
    });
  }

  async showDetails(idClub: number) {
    await this.router.navigate([ '/club', idClub ]);
  }

  async fetchClubList(): Promise<void> {
    return this.clubSrv
      .getAllClubs()
      .then(reqClubs => {
        this.clubs = reqClubs;
        this.tableDataSource.data = this.clubs;
      })
      .catch(err => {
        console.error(err);
      });
  }

  deleteClub(club: Club) {
    this.openDialog(club);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private openDialog(club: Club): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO
        // this.fetchClubList();
      }
    });
  }
}
