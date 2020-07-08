import { Component, OnInit } from '@angular/core';
import { Member, Sexe, Club } from 'src/app/core/models';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

class NewMember implements Member {
  firstname: string;
  lastname: string;
  sexe: Sexe;
  email: string;
  phone: string;
  birthdate: Date;
  club?: Club;
}

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: [ './member-add.component.scss' ]
})
export class MemberAddComponent implements OnInit {
  member: NewMember;

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {}

  ngOnInit() {
    this.member = new NewMember();
  }

  saved(savedMember) {
    if (savedMember.id) {
      this.location.back();
    }
  }
}
