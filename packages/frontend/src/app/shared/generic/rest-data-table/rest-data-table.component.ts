import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from 'src/app/core/services';
import { RESTService } from 'src/app/core/services/rest.service';

@Component({
  selector: 'app-rest-data-table',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
      <ng-container [matColumnDef]="tableData" *ngFor="let tableData of objectKeys(ressourceColumns)">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ressourceColumns[tableData]}} </th>
          <td mat-cell *matCellDef="let element; let i=index;"> {{element[tableData]}}</td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element">
          <button
            mat-icon-button
            [routerLink]="['/', 'app', ressourceName, element.id]"
            color="primary"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteEle(element)" color="warn">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedCol"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCol;"></tr>
    </table>`,
  styles: []
})
export class RestDataTableComponent implements OnInit {

  @Input() ressourceAPI: string;
  @Input() ressourceName: string;
  @Input() ressourceColumns: string;
  @Input() action: boolean;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  objectKeys = Object.keys;
  dataSource = new MatTableDataSource([]);
  displayedCol = [];

  private restSrv: RESTService;

  constructor(
    private readonly apiSrv: ApiService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.restSrv = new RESTService(this.ressourceAPI, this.apiSrv);
    this.init().catch(err => console.error(err));
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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

  private async init() {
    this.dataSource.data = await this.restSrv.getAll();
    this.dataSource.sort = this.sort;
    this.displayedCol = Object.keys(this.ressourceColumns);
    if (this.action) {
      this.displayedCol.push('action');
    }
  }

}
