import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from 'src/app/core/services';
import { RESTService } from 'src/app/core/services/rest.service';

@Component({
  selector: 'app-rest-data-table',
  templateUrl: './rest-data-table.component.html',
  styleUrls: [ './rest-data-table.component.scss' ]
})
export class RestDataTableComponent implements OnInit {

  @Input() resourceAPI: string;
  @Input() resourceName: string;
  @Input() resourceColumns: string;
  @Input() action: boolean;

  @Output() ready = new EventEmitter<boolean>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  objectKeys = Object.keys;
  dataSource = new MatTableDataSource([]);
  displayedCol = [];

  displayProgress = true;

  private restSrv: RESTService;
  private loadedData: [] | null;

  constructor(
    private readonly apiSrv: ApiService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.restSrv = new RESTService(this.resourceAPI, this.apiSrv);
    this.init().catch(err => console.error(err)).finally(() => {
      this.ready.emit(true);
    });
  }

  // TODO: Add search filter
  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  /**
   * Filter the REST data of the data table
   * @param filterFunc The function used to filter, rest data are passed in params
   * @returns void
   */
  filter(filterFunc: (data: any) => any) {
    if (filterFunc) {
      const filteredData = filterFunc(this.loadedData);
      this.dataSource.data = filteredData;
    }
  }

  /**
   * Delete an element on the table
   * @param element the element to delete
   */
  deleteEle(element) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restSrv.delete(element).catch(err => console.error(err));
      }
    });
  }

  /**
   * Will init the rest data table
   */
  private async init() {
    this.loadedData = await this.restSrv.getAll();
    this.dataSource.data = this.loadedData;
    this.dataSource.sort = this.sort;
    this.displayedCol = Object.keys(this.resourceColumns);
    if (this.action) {
      this.displayedCol.push('action');
    }

    this.displayProgress = false;
  }

}
