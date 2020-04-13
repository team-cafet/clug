import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  Member,
  MemberService,
  displaySexe,
  displayFinancialStatus,
} from 'src/app/core/core.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteDialogComponent } from 'src/app/member/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  ];
  tableDataSource = new MatTableDataSource([]);

  constructor(
    private memberSrv: MemberService,
    public dialog: MatDialog,
  ) {}

  @ViewChild(MatSort, { static: true }) tableSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) tablePaginator: MatPaginator;

  ngOnInit(): void {
    this.tableDataSource.sort = this.tableSort;
    this.tableDataSource.paginator = this.tablePaginator;

    this.memberSrv
      .getAllMember()
      .then((reqMembers) => {
        this.members = reqMembers;
        this.tableDataSource.data = this.members;
      })
      .catch((e) => {
        console.error(e);
      });
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

  public editMember(id: number) {
    console.log(`edit member no ${id}`);
    // TODO
  }

  public deleteMember(member: Member) {
    this.openDialog(member);
    // TODO
  }

  public addMember() {
    console.log(`Add member`);
    // TODO
  }
  private openDialog(member: Member): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: member
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
