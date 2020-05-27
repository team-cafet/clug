import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  displayFinancialStatus,
  displaySexe,
  Member,
  MemberService
} from 'src/app/core/core.module';
import { DeleteDialogComponent } from '../../shared/shared.module';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: [ './member.component.scss' ]
})
export class MemberComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) tableSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) tablePaginator: MatPaginator;

  members: Member[];
  displayedColumns: string[] = [
    'id',
    'name',
    'surname',
    'sexe',
    'financialStatus',
    'phone',
    'club',
    'action'
  ];


  tableDataSource = new MatTableDataSource([]);

  constructor(private readonly memberSrv: MemberService, private readonly dialog: MatDialog) {}


  ngOnInit(): void {
    this.tableDataSource.sort = this.tableSort;
    this.tableDataSource.paginator = this.tablePaginator;
    this.fetchMembersList().finally(() => {
      // TODO
    });
  }

  displaySexe(sexe) {
    return displaySexe(sexe);
  }

  displayFinancialStatus(financialStatus) {
    return displayFinancialStatus(financialStatus);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteMember(member: Member) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberSrv.delete(member).catch(err => {
          console.error(err);
        }).finally(() => {
          this.fetchMembersList().finally(() => {
            // TODO
          });
        });
      }
    });
  }

  async fetchMembersList(): Promise<void> {
    return this.memberSrv
      .getAll()
      .then(reqMembers => {
        this.members = reqMembers;
        this.tableDataSource.data = this.members;
      })
      .catch(err => {
        console.error(err);
      });
  }
}
