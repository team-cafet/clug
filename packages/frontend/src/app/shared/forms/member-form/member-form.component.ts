import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Member, Sexe, displaySexe, Club } from 'src/app/core/models';
import { MemberService, ClubService } from 'src/app/core/services';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: [ './member-form.component.scss' ]
})
export class MemberFormComponent implements OnInit, OnChanges {
  @Input() member: Member;
  @Output() saved = new EventEmitter<Member>();

  SEXE_LABEL = [ Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY ];
  displaySexe = displaySexe;
  clubs: Club[];

  constructor(
    private readonly memberSrv: MemberService,
    private readonly clubSrv: ClubService
  ) {}

  async ngOnInit() {

    this.clubs = await this.clubSrv.getAllClubs();
  }

  ngOnChanges(changes) {
    const currentMemberToCheck = changes.member.currentValue;

    if (!currentMemberToCheck.club || !currentMemberToCheck.club.id) {
      this.member.club = { id: undefined, designation: '' };
    }
  }

  async save() {
    const backupMember = this.member;
    try {
      // delete this.member.createdAt;
      // delete this.member.updatedAt;
      // delete this.member.deletedAt;
      // delete this.member.financialStatus;
      // for (const props in this.member) {
      //   if (this.member[props] === null) {
      //     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      //     delete this.member[props];
      //   }
      // }

      if (this.member.id) {
        this.member = await this.memberSrv.saveOne(this.member);
      } else {
        this.member = await this.memberSrv.addOne(this.member);
      }

      this.saved.emit(this.member);

    } catch (error) {
      console.error(error);
      this.member = backupMember;
    }
  }
}
