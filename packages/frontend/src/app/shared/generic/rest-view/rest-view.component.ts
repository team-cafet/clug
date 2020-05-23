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
        [routerLink]="['/', 'app', ressourceName, 'add']"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
    <div>
      <app-rest-data-table
        [ressourceColumns]="ressourceColumns"
        [ressourceName]="ressourceName"
        [ressourceAPI]="ressourceName"
        action='true'></app-rest-data-table>
    </div>
  </div>`,
  styleUrls: [ './rest-view.component.scss' ]
})
export class RestViewComponent implements OnInit {
  @Input() ressourceName: string;
  @Input() ressourceAPI: string;
  @Input() ressourceColumns: string;

  private restSrv: RESTService;

  constructor(
    private readonly apiSrv: ApiService
  ) {
  }

  ngOnInit() {
    this.restSrv = new RESTService(this.ressourceAPI, this.apiSrv);
  }

}
