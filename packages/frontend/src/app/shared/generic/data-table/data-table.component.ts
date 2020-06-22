import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';


export interface DataTableColumn {
  headerName: string;
  accessorName: string;
  display: boolean;
  customDisplayFunc?: (element: any) => void;
  customCellCSS?: (element: any) => string;
}

export interface Actions {
  details: {
    accessorColID: string;
    resourceName: string;
    display: boolean;
  };
  delete: {
    deleteFunc: (element: any) => void;
    display: boolean;
  };
  select: {
    display: boolean;
  };
  paginator: {
    display: boolean;
  };
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [ './data-table.component.scss' ]
})
export class DataTableComponent implements OnInit, OnChanges {


  @Input() columns: DataTableColumn[];
  @Input() data: any[];
  @Input() actions: Actions;

  @Output() changeSelectedElement = new EventEmitter<any[]>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  dataSource = new MatTableDataSource([]);
  tableSelection = new SelectionModel<any>(true, []);
  displayedCol = [];

  displayProgress = true;

  ngOnInit() {
    this.init();

    this.tableSelection.changed.subscribe(() => {
      this.changeSelectedElement.emit(this.tableSelection.selected);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue ? changes.data.currentValue : this.data;
    this.init();
  }

  /**
   * Delete an element on the table
   * @param element the element to delete
   */
  deleteEle(element) {
    if (!this.actions || !this.actions.delete) {
      return;
    }

    this.actions.delete.deleteFunc(element);
  }

  /**
   * Whether the number of selected elements matches the total
   * number of rows.
   */
  isAllSelected() {
    const numSelected = this.tableSelection.selected.length;
    const numRows = this.dataSource.data.length;
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
      this.dataSource.data.forEach(row => this.tableSelection.select(row));
    }
  }

  /**
   * Will init the rest data table
   */
  private init() {
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.displayedCol = this.columns.map(col => col.display ? col.accessorName : undefined);

    if (this.actions) {
      this.displayedCol.push('action');
      this.displayedCol.push('action-mobile');

      if (this.actions.select.display) {
        this.displayedCol = [ 'select', ...this.displayedCol ];
      }
    }


    this.displayProgress = false;
  }

}
