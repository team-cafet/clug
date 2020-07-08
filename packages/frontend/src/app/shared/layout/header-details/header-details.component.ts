import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: [ './header-details.component.scss' ]
})
export class HeaderDetailsComponent implements OnInit {
  @Input() resourceName: string;

  constructor(private readonly location: Location) {}

  ngOnInit(): void {
    // ...
  }

  goBack() {
    // Maybe in the future we will need this ?
    // ['/', 'app', resourceName]
    this.location.back();
  }

}
