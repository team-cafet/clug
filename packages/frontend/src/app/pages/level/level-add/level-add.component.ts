import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level-add',
  templateUrl: './level-add.component.html',
  styleUrls: [ './level-add.component.scss' ]
})
export class LevelAddComponent implements OnInit {
  level: Level;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.level = { name: null, description: null };
  }

  async saved(savedLevel) {
    await this.router.navigate([ '/level', savedLevel.id ]);
  }
}
