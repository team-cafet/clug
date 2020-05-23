import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: [ './level.component.scss' ]
})
export class LevelComponent implements OnInit {
  ressourceCols = { name: 'Name', description: 'Description' };

  ngOnInit(): void {
    // ...
  }
}
