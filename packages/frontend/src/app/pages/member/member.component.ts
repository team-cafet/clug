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
  FinancialStatus
} from 'src/app/core/core.module';
import { DeleteDialogComponent } from '../../shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';

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
    'select',
    'id',
    'firstname',
    'lastname',
    'sexe',
    'financialStatus',
    'phone',
    'club',
    'action'
  ];

  tableDataSource = new MatTableDataSource([]);

  tableSelection = new SelectionModel<Member>(true, []);

  constructor(private readonly memberSrv: MemberService, private readonly dialog: MatDialog) {}


  ngOnInit(): void {
    this.tableDataSource.sort = this.tableSort;
    this.tableDataSource.paginator = this.tablePaginator;
    this.fetchMembersList().finally(() => {
      // TODO
    });
  }

  /**
   * Utilitie function to translate sexe enum in string
   * @param sexe
   */
  displaySexe(sexe) {
    return displaySexe(sexe);
  }

  /**
   * Utilitie function to translate finStat enum in string
   * @param financialStatus
   */
  displayFinancialStatus(financialStatus) {
    return displayFinancialStatus(financialStatus);
  }

  /**
   * Function to filter element with the search
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Manage the supression of a member
   * @param member
   */
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

  /**
   * Get all member from api
   */
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

  /**
   * Whether the number of selected elements matches the total
   * number of rows.
   */
  isAllSelected() {
    const numSelected = this.tableSelection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected;
   * otherwise clear selection.
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.tableSelection.clear();
    } else {
      this.tableDataSource.data.forEach(row => this.tableSelection.select(row));
    }
  }

  /**
   * Will update all the table selected memmber finStat to
   * The selected one
   * @param financialStatus
   */
  updateSelectedMemberFinStatusTo(financialStatus: FinancialStatus) {
    const SELECTED_MEMBER = this.tableSelection.selected;

    for (const member of SELECTED_MEMBER) {
      member.financialStatus = financialStatus;

      this.memberSrv.saveOne({ id: member.id, financialStatus: member.financialStatus })
        .catch(err => console.error(err));
    }
  }
}
