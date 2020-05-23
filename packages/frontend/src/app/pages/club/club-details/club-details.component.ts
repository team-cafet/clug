import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from 'src/app/core/services';

@Component({
  selector: 'app-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: [ './club-details.component.scss' ]
})
export class ClubDetailsComponent implements OnInit {
  club: Club;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly clubSrv: ClubService
  ) { }

  async ngOnInit(): Promise<void> {
    const ID_CLUB = this.route.snapshot.paramMap.get('id');
    try {
      this.club = await this.clubSrv.getOneById(ID_CLUB);
      if (!this.club) {
        throw new Error(`Club with id ${ID_CLUB} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
