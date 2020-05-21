import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  displayFinancialStatus,
  displaySexe,
  Member,
  MemberService,
} from 'src/app/core/core.module';
import { DeleteDialogComponent } from '../../shared/shared.module';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  members: Member[];
  displayedColumns: string[] = [
    'id',
    'name',
    'surname',
    'sexe',
    'financialStatus',
    'phone',
    'club',
    'action',
  ];
  tableDataSource = new MatTableDataSource([]);

  constructor(private memberSrv: MemberService, public dialog: MatDialog) {}

  @ViewChild(MatSort, { static: true }) tableSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) tablePaginator: MatPaginator;

  ngOnInit(): void {
    this.tableDataSource.sort = this.tableSort;
    this.tableDataSource.paginator = this.tablePaginator;
    this.fetchMembersList();
  }

  public displaySexe(sexe) {
    return displaySexe(sexe);
  }

  public displayFinancialStatus(financialStatus) {
    return displayFinancialStatus(financialStatus);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteMember(member: Member) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.memberSrv.delete(member);
          this.fetchMembersList();
        } catch (err) {
          //TODO
        }
      }
    });
  }

  public async fetchMembersList(): Promise<void> {
    return this.memberSrv
      .getAllMember()
      .then((reqMembers) => {
        this.members = reqMembers;
        this.tableDataSource.data = this.members;
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
