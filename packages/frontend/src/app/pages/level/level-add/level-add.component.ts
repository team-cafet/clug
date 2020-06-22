import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { Location } from '@angular/common';


@Component({
  selector: 'app-level-add',
  templateUrl: './level-add.component.html',
  styleUrls: [ './level-add.component.scss' ]
})
export class LevelAddComponent implements OnInit {
  level: Level;
  constructor(private readonly location: Location) {}

  ngOnInit(): void {
    this.level = { name: null, description: null };
  }

  saved(savedLevel) {
    this.location.back();
  }
}
