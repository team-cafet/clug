import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-details',
  template: `
  <mat-toolbar color="primary">
    <mat-toolbar-row>
      <button mat-icon-button type="button" [routerLink]="['/', 'app', resourceName]">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>{{resourceName}}</span>
    </mat-toolbar-row>
  </mat-toolbar>
  `,
  styleUrls: [ './header-details.component.scss' ]
})
export class HeaderDetailsComponent implements OnInit {
  @Input() resourceName: string;

  ngOnInit(): void {
    // ...
  }

}
