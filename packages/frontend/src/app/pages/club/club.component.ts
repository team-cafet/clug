import { Component, OnInit } from '@angular/core';
import { DataTableColumn } from 'src/app/shared/generic/data-table/data-table.component';
import { RestViewComponentAction } from 'src/app/shared/generic/rest-view/rest-view.component';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: [ './club.component.scss' ]
})
export class ClubComponent implements OnInit {
  columns: DataTableColumn[];
  actions: RestViewComponentAction;

  constructor() {
    this.columns = [
      {
        headerName: 'Designation',
        accessorName: 'designation',
        display: true
      },
      {
        headerName: 'Description',
        accessorName: 'description',
        display: true
      }
    ];

    this.actions = {
      details: {
        display: true
      },
      delete: {
        display: true
      },
      select: {
        display: false
      },
      paginator: {
        display: false
      }
    };
  }

  ngOnInit(): void {
    // ...
  }
}
