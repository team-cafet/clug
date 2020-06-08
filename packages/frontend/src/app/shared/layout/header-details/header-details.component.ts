import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: [ './header-details.component.scss' ]
})
export class HeaderDetailsComponent implements OnInit {
  @Input() resourceName: string;

  ngOnInit(): void {
    // ...
  }

}
