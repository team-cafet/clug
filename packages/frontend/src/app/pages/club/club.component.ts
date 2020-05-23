import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: [ './club.component.scss' ]
})
export class ClubComponent implements OnInit {
  ressourceCols = { designation: 'Designation', description: 'Description' };

  ngOnInit(): void {
    // ...
  }
}
