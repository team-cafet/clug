import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Member, Sexe, displaySexe, Club, Level } from 'src/app/core/models';
import {
  MemberService,
  ClubService,
  LevelService
} from 'src/app/core/services';
import { cleanObjectForSending } from 'src/app/core/functions';

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
  levels: Level[];

  constructor(
    private readonly memberSrv: MemberService,
    private readonly clubSrv: ClubService,
    private readonly levelSrv: LevelService
  ) {}

  async ngOnInit() {
    [ this.clubs, this.levels ] = await Promise.all([
      this.clubSrv.getAll(),
      this.levelSrv.getAll()
    ]);
  }

  ngOnChanges(changes) {
    const currentMemberToCheck = changes.member.currentValue;

    if (!currentMemberToCheck.club || !currentMemberToCheck.club.id) {
      this.member.club = { id: undefined, designation: '' };
    }

    if (!currentMemberToCheck.level || !currentMemberToCheck.level.id) {
      this.member.level = { id: undefined, name: '' };
    }
  }

  async save() {
    const backupMember = this.member;
    try {
      const cleanedMember = cleanObjectForSending(this.member);
      delete this.member.financialStatus;

      if (this.member.id) {
        this.member = await this.memberSrv.saveOne(cleanedMember);
      } else {
        this.member = await this.memberSrv.addOne(cleanedMember);
      }

      this.saved.emit(this.member);
    } catch (error) {
      console.error(error);
      this.member = backupMember;
    }
  }
}
