import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Level, LevelService } from 'src/app/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../shared/shared.module';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: [ './level.component.scss' ]
})
export class LevelComponent implements OnInit {
  // levels: Level[] = [];
  // tableDataSource = new MatTableDataSource([]);
  // // displayedColumns: string[] = [ 'name', 'description', 'action' ];
  ressourceCols = { name: 'Name', description: 'Description' };

  constructor(
    // private readonly levelSrv: LevelService,
    // private readonly router: Router,
    // private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.levelSrv
    //   .getAll()
    //   .then(results => {
    //     this.levels = results;
    //     // this.tableDataSource.data = this.levels;
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }

  async showDetails(id: number) {
    // await this.router.navigate([ '/level', id ]);
  }

  deleteClub(level: Level) {
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.memberSrv.delete(member).catch(err => {
    //       console.error(err);
    //     }).finally(() => {
    //       this.fetchMembersList().finally(() => {
    //         // TODO
    //       });
    //     });
    //   }
    // });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private openDialog(level: Level): void {
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   width: '450px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // TODO
    //     // this.fetchClubList();
    //   }
    // });
  }
}
