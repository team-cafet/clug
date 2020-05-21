import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/core/services';

@Component({
  selector: 'app-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: ['./club-details.component.scss']
})
export class ClubDetailsComponent implements OnInit {
  ID_CLUB = null;
  club: Club;

  constructor(private route: ActivatedRoute, private clubSrv: ClubService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.ID_CLUB = this.route.snapshot.paramMap.get('id');
    try {
      this.club = await this.clubSrv.getOneById(this.ID_CLUB);
      if (!this.club) {
        throw new Error(`Club with id ${this.ID_CLUB} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async save() {
    try {
      for (const props in this.club) {
        if (this.club[props] === null) {
          delete this.club[props];
        }
      }
      this.club = await this.clubSrv.saveOne(this.club);
      this.router.navigate(['/club']);
    } catch (error) {
      console.error(error);
    }
  }

}
