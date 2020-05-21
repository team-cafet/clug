import { Component, OnInit } from '@angular/core';
import { Member, Sexe, displaySexe, Club } from 'src/app/core/models';
import { MemberService, ClubService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: [ './member-details.component.scss' ]
})
export class MemberDetailsComponent implements OnInit {
  ID_MEMBER = null;
  SEXE_LABEL = [ Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY ];
  member: Member;
  displaySexe = displaySexe;
  clubs: Club[];
  clubSelected: string;

  constructor(
    private readonly memberSrv: MemberService,
    private readonly route: ActivatedRoute,
    private readonly clubSrv: ClubService
  ) {}

  async ngOnInit() {
    this.ID_MEMBER = this.route.snapshot.paramMap.get('id');
    try {
      this.member = await this.memberSrv.getOneById(this.ID_MEMBER);
      this.clubSelected = this.member.club.id;
      this.clubs = await this.clubSrv.getAllClubs();
      if (!this.member) {
        throw new Error(`Member with id ${this.ID_MEMBER} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async save() {
    try {
      delete this.member.createdAt;
      delete this.member.updatedAt;
      delete this.member.deletedAt;
      delete this.member.financialStatus;
      for (const props in this.member) {
        if (this.member[props] === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.member[props];
        }
      }
      this.member.club = { id: this.clubSelected, designation: '' };

      this.member = await this.memberSrv.saveOne(this.member);
    } catch (error) {
      console.error(error);
    }
  }
}
