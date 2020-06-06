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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { cleanObjectForSending } from 'src/app/core/functions';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: [ './member-form.component.scss' ]
})
export class MemberFormComponent implements OnInit, OnChanges {
  @Input() member: Member;
  @Output() saved = new EventEmitter<Member>();

  memberForm: FormGroup;

  SEXE_LABEL = [ Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY ];
  displaySexe = displaySexe;
  clubs: Club[];
  levels: Level[];

  constructor(
    private readonly memberSrv: MemberService,
    private readonly clubSrv: ClubService,
    private readonly levelSrv: LevelService,
    private readonly fb: FormBuilder
  ) {}

  async ngOnInit() {
    if (!this.member) {
      throw new Error('MemberFormComponent: member undefined');
    }

    this.memberForm = this.fb.group({
      name: [ this.member.name, [ Validators.required ] ],
      surname: [ this.member.surname, [ Validators.required ] ],
      sexe: [ this.member.sexe ],
      birthdate: [ this.member.birthdate ],
      phone: [ this.member.phone ],
      email: [ this.member.email, [ Validators.required ] ],
      club: [ this.member.club.id ],
      level: [ this.member.level.id ]
    });

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
    const cleanedMember = cleanObjectForSending(this.memberForm.value);
    try {
      if (this.member.id) {
        this.member = await this.memberSrv.saveOne({ id: this.member.id, ...cleanedMember });
      } else {
        this.member = await this.memberSrv.addOne(cleanedMember);
      }

      this.saved.emit(this.member);
    } catch (error) {
      console.error(error);
    }
  }
}
