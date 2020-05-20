import { Component, OnInit } from '@angular/core';
import { Member, Sexe, displaySexe, Club } from 'src/app/core/models';
import { MemberService, ClubService } from 'src/app/core/services';
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
  styleUrls: ['./member-add.component.scss'],
})
export class MemberAddComponent implements OnInit {
  SEXE_LABEL = [Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY];
  member: Member;
  displaySexe = displaySexe;
  clubs: Club[];

  constructor(private memberSrv: MemberService, private router: Router, private clubSrv: ClubService) {}

  async ngOnInit() {
    this.member = new NewMember();
    this.clubs = await this.clubSrv.getAllClubs();
    for (const key in this.member) {
      if (this.member[key]) {
        this.member[key] = null;
      }
    }
  }

  async save() {
    try {
      for (const props in this.member) {
        if (this.member[props] === null) {
          delete this.member[props];
        }
      }

      this.member = await this.memberSrv.addOne(this.member);
      this.router.navigate(['/member', this.member.id]);
    } catch (error) {
      console.error(error);
    }
  }
}
