import { Component, OnInit } from '@angular/core';
import { Member, Sexe, displaySexe } from 'src/app/core/models';
import { MemberService } from 'src/app/core/services';
import { Router } from '@angular/router';

class NewMember implements Member {
  name: string;
  surname: string;
  sexe: Sexe;
  email: string;
  phone: string;
  birthdate: Date;
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

  constructor(private memberSrv: MemberService, private router: Router) {}

  async ngOnInit() {
    this.member = new NewMember();

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
