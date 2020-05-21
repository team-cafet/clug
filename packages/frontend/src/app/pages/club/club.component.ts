import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Club, ClubService } from 'src/app/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../shared/shared.module';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  clubs: Club[] = [];
  tableDataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['designation', 'description', 'action'];

  constructor(
    private clubSrv: ClubService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchClubList();
  }

  public showDetails(idClub: number) {
    this.router.navigate(['/club', idClub]);
  }

  public async fetchClubList(): Promise<void> {
    return this.clubSrv
      .getAllClubs()
      .then((reqClubs) => {
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
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // TODO
        // this.fetchClubList();
      }
    });
  }
}
