import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  displayFinancialStatus,
  displaySexe,
  Member,
  MemberService,
  FinancialStatus
} from 'src/app/core/core.module';
import { DeleteDialogComponent } from '../../shared/shared.module';
import { DataTableColumn, Actions } from 'src/app/shared/generic/data-table/data-table.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: [ './member.component.scss' ]
})
export class MemberComponent implements OnInit {

  columns: DataTableColumn[];

  actions: Actions;

  members: Member[];

  membersDataTable: Member[];

  currentSelection: Member[] = [];

  constructor(
    private readonly memberSrv: MemberService,
    private readonly dialog: MatDialog
  ) {
    this.actions = {
      details: {
        accessorColID: 'id',
        display: true,
        resourceName: 'member'
      },
      delete: {
        deleteFunc: member => this.deleteMember(member),
        display: true
      },
      select: {
        display: true
      },
      paginator: {
        display: true
      }
    };

    this.columns = [
      {
        headerName: 'Last Name',
        accessorName: 'lastname',
        display: true
      },
      {
        headerName: 'First Name',
        accessorName: 'firstname',
        display: true
      },
      {
        headerName: 'Phone',
        accessorName: 'phone',
        display: true
      },
      {
        headerName: 'Financial Status',
        accessorName: 'financialStatus',
        display: true,
        customDisplayFunc: element => displayFinancialStatus(element.financialStatus),
        customCellCSS: element => {
          switch (element.financialStatus) {
            case 2:
              return 'color: red';
            case 1:
              return 'color: orange';
            default:
              return 'color: green';
          }
        }
      }
    ];

  }


  ngOnInit(): void {
    this.fetchMembersList().finally(() => {
      this.membersDataTable = this.members;
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
    const STRING_TO_SEARCH = filterValue.trim().toLowerCase();
    this.membersDataTable = this.members.filter(
      member => {
        for (const col in member) {
          if (member[col] && `${member[col]}`.includes(STRING_TO_SEARCH)) {
            return true;
          }
        }
        return false;
      }
    );
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
      })
      .catch(err => {
        console.error(err);
      });
  }

  changeSelection(selection) {
    this.currentSelection = selection;
  }

  /**
   * Will update all the table selected memmber finStat to
   * The selected one
   * @param financialStatus
   */
  updateSelectedMemberFinStatusTo(financialStatus: FinancialStatus) {
    const SELECTED_MEMBER = this.currentSelection;

    for (const member of SELECTED_MEMBER) {
      member.financialStatus = financialStatus;

      this.memberSrv.saveOne({ id: member.id, financialStatus: member.financialStatus })
        .catch(err => console.error(err));
    }
  }
}
