import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/core/services';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: [ './level-details.component.scss' ]
})
export class LevelDetailsComponent implements OnInit {
  ID_LEVEL = null;
  club: Level;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly clubSrv: ClubService, private readonly router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.ID_LEVEL = this.route.snapshot.paramMap.get('id');
    try {
      this.club = await this.clubSrv.getOneById(this.ID_LEVEL);
      if (!this.club) {
        throw new Error(`Level with id ${this.ID_LEVEL} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
