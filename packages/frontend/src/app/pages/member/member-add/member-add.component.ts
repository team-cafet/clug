import { Component, OnInit } from '@angular/core';
import { Member, Sexe, Club } from 'src/app/core/models';
import { Router } from '@angular/router';

class NewMember implements Member {
  name: string;
  surname: string;
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
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.member = new NewMember();
  }

  async saved(savedMember) {
    if (savedMember.id) {
      await this.router.navigate([ '/app/member', savedMember.id ]);
    }
  }
}
