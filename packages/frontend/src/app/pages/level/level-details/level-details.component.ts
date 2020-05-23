import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from 'src/app/core/services';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: [ './level-details.component.scss' ]
})
export class LevelDetailsComponent implements OnInit {
  level: Level;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly levelSrv: LevelService,
    private readonly router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const ID_LEVEL = this.route.snapshot.paramMap.get('id');
    try {
      this.level = await this.levelSrv.getOneById(ID_LEVEL);
      if (!this.level) {
        throw new Error(`Level with id ${ID_LEVEL} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
