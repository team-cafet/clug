import { Component, OnInit } from '@angular/core';
import { Member, Sexe, displaySexe } from 'src/app/core/models';
import { MemberService } from 'src/app/core/services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  ID_MEMBER = null;
  SEXE_LABEL = [Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY];
  member: Member;
  displaySexe = displaySexe;

  constructor(
    private memberSrv: MemberService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.ID_MEMBER = this.route.snapshot.paramMap.get('id');
    try {
      this.member = await this.memberSrv.getOneById(this.ID_MEMBER);
      if (!this.member) {
        throw new Error(`Member with id ${this.ID_MEMBER} Not Defined`);
      }
      console.log(this.member);
    } catch (error) {
      console.error(error);
    }
  }

  async save() {
    console.log(this.member);
    try {
      delete this.member.createdAt;
      delete this.member.updatedAt;
      delete this.member.deletedAt;
      delete this.member.financialStatus;

      for (const props in this.member) {
        if (this.member[props] === null) {
          delete this.member[props];
        }
      }

      this.member = await this.memberSrv.saveOne(this.member);
    } catch (error) {
      console.error(error);
    }
  }

  async delete() {}
}
