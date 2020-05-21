import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ClubService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.component.html',
  styleUrls: [ './add-club.component.scss' ]
})
export class AddClubComponent implements OnInit {
  club: Club;
  constructor(private readonly clubSrv: ClubService, private readonly router: Router) {}

  ngOnInit(): void {
    this.club = { designation: null, description: null };
  }

  async save() {
    try {
      for (const props in this.club) {
        if (this.club[props] === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.club[props];
        }
      }
      this.club = await this.clubSrv.addOne(this.club);
      await this.router.navigate([ '/club', this.club.id ]);
    } catch (error) {
      console.error(error);
    }
  }
}
