import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services';
import { RESTService } from 'src/app/core/services/rest.service';

@Component({
  selector: 'app-rest-view',
  templateUrl: './rest-view.component.html',
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
