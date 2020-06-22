import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-club-add',
  templateUrl: './club-add.component.html',
  styleUrls: [ './club-add.component.scss' ]
})
export class ClubAddComponent implements OnInit {
  club: Club;
  constructor(private readonly location: Location) {}

  ngOnInit(): void {
    this.club = { designation: null, description: null };
  }

  saved(savedClub) {
    this.location.back();
  }
}
