import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services';
import { RESTService } from 'src/app/core/services/rest.service';
import { DataTableColumn, Actions } from '../data-table/data-table.component';
import { DeleteDialogComponent } from '../../generic/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface RestViewComponentAction {
  details: {
    display: boolean;
  };
  delete: {
    display: boolean;
  };
  select: {
    display: boolean;
  };
  paginator: {
    display: boolean;
  };
  menu?: {
    display: boolean;
    menuActions: Array<{title: string; actFunc: (selection: any[]) => void}>;
  };
}

@Component({
  selector: 'app-rest-view',
  templateUrl: './rest-view.component.html',
  styleUrls: [ './rest-view.component.scss' ]
})
export class RestViewComponent implements OnInit {
  @Input() resourceName: string;
  @Input() resourceAPI: string;
  @Input() columns: DataTableColumn[];
  @Input() actions: RestViewComponentAction;

  data: any[];
  dataWithFilter: any[];
  dataSelection: any[];

  dataTableAction: Actions;

  private restSrv: RESTService;

  constructor(
    private readonly apiSrv: ApiService,
    private readonly dialog: MatDialog

  ) {}

  ngOnInit() {
    this.restSrv = new RESTService(this.resourceAPI, this.apiSrv);

    this.dataTableAction = {
      ...this.actions,
      details: {
        accessorColID: 'id',
        display: true,
        resourceName: this.resourceName
      },
      delete: {
        display: this.actions.delete.display,
        deleteFunc: element => this.deleteElement(element)
      }
    };

    this.restSrv.getAll().then(result => {
      this.data = result;
    }).catch(err => console.error(err))
      .finally(() => {
        this.dataWithFilter = this.data;
      });
  }

  deleteElement(element) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restSrv.delete(element).catch(err => console.error(err));
      }
    });
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const STRING_TO_SEARCH = filterValue.trim().toLowerCase();
    this.dataWithFilter = this.data.filter(
      element => {
        for (const col in element) {

          // TODO: Improve filter
          if (element[col] &&
            `${element[col]}`.trim().toLowerCase().includes(STRING_TO_SEARCH)) {
            return true;
          }
        }
        return false;
      }
    );
  }

  changeSelection(currSelection) {
    this.dataSelection = currSelection;
  }

}
