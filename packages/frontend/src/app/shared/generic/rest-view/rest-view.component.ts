import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services';
import { RESTService } from 'src/app/core/services/rest.service';

@Component({
  selector: 'app-rest-view',
  template: `
  <div>
    <div>
      <button
        mat-mini-fab
        color="primary"
        color="primary"
        [routerLink]="['/', 'app', resourceName, 'add']"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
    <div>
      <app-rest-data-table
        [resourceColumns]="resourceColumns"
        [resourceName]="resourceName"
        [resourceAPI]="resourceName"
        action='true'></app-rest-data-table>
    </div>
  </div>`,
  styleUrls: [ './rest-view.component.scss' ]
})
export class RestViewComponent implements OnInit {
  @Input() resourceName: string;
  @Input() resourceAPI: string;
  @Input() resourceColumns: string;

  private restSrv: RESTService;

  constructor(
    private readonly apiSrv: ApiService
  ) {
  }

  ngOnInit() {
    this.restSrv = new RESTService(this.resourceAPI, this.apiSrv);
  }

}
