import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.component.html',
  styleUrls: [ './add-club.component.scss' ]
})
export class AddClubComponent implements OnInit {
  club: Club;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.club = { designation: null, description: null };
  }

  async saved(savedClub) {
    await this.router.navigate([ '/club', savedClub.id ]);
  }
}
