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
import { DeleteDialogComponent } from 'src/app/member/delete-dialog/delete-dialog.component';

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
    'action',
    'club'
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
    this.openDialog(member);
  }

  public addMember() {
    console.log(`Add member`);
    // TODO
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

  private openDialog(member: Member): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: member,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchMembersList();
      }
    });
  }
}
