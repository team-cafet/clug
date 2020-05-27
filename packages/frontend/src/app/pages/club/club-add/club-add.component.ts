import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-club-add',
  templateUrl: './club-add.component.html',
  styleUrls: [ './club-add.component.scss' ]
})
export class ClubAddComponent implements OnInit {
  club: Club;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.club = { designation: null, description: null };
  }

  async saved(savedClub) {
    await this.router.navigate([ '/club', savedClub.id ]);
  }
}
