import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import {
  Member,
  Sexe,
  displaySexe,
  Club,
  Level,
  Address
} from 'src/app/core/models';
import {
  MemberService,
  ClubService,
  LevelService,
  AddressService
} from 'src/app/core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { cleanObjectForSending } from 'src/app/core/functions';
import { DeleteDialogComponent } from '../../generic/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: [ './member-form.component.scss' ]
})
export class MemberFormComponent implements OnInit, OnChanges {
  @Input() member: Member;
  @Output() saved = new EventEmitter<Member>();

  memberForm: FormGroup;
  addressForm: FormGroup;

  SEXE_LABEL = [ Sexe.FEMALE, Sexe.MALE, Sexe.NON_BINARY ];
  displaySexe = displaySexe;
  clubs: Club[];
  levels: Level[];

  constructor(
    private readonly memberSrv: MemberService,
    private readonly addressSrv: AddressService,
    private readonly clubSrv: ClubService,
    private readonly levelSrv: LevelService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {}

  async ngOnInit() {
    if (!this.member) {
      throw new Error('MemberFormComponent: member undefined');
    }

    this.memberForm = this.fb.group({
      firstname: [ this.member.firstname, [ Validators.required ] ],
      lastname: [ this.member.lastname, [ Validators.required ] ],
      sexe: [ this.member.sexe ],
      birthdate: [ this.member.birthdate ],
      phone: [ this.member.phone ],
      email: [ this.member.email, [ Validators.required ] ],
      club: [ this.member.club.id ],
      level: [ this.member.level.id ]
    });
    this.addressForm = this.fb.group({
      street: [ this.member.address.street ],
      streetNumber: [ this.member.address.streetNumber ],
      city: [ this.member.address.city ],
      postalCode: [ this.member.address.postalCode ],
      country: [ this.member.address.country ]
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

    if (!currentMemberToCheck.address || !currentMemberToCheck.address.id) {
      this.member.address = {
        id: undefined,
        city: undefined,
        postalCode: undefined,
        street: undefined,
        streetNumber: undefined,
        country: undefined
      };
    }
  }

  async save() {
    const cleanedMember = cleanObjectForSending(this.memberForm.value);
    const address: Address = this.addressForm.value;
    let memberResult;
    let addressResult;

    try {
      if (this.member.id) {
        memberResult = await this.memberSrv.saveOne({
          id: this.member.id,
          ...cleanedMember
        });

        if (address) {
          addressResult = await this.addressSrv.saveOne({
            id: this.member.address.id,
            ...address
          });
        }

        this.member = { ...this.member, ...memberResult, address: { ...addressResult } };

      } else {
        addressResult = await this.addressSrv.addOne(address);
        cleanedMember.address = this.member.address.id;
        memberResult = await this.memberSrv.addOne(cleanedMember);
        this.member = { ...this.member, ...memberResult, address: { ...addressResult } };
      }
      this.saved.emit(this.member);
    } catch (error) {
      console.error(error);
    }
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberSrv
          .delete(this.member)
          .catch(err => console.error(err))
          .finally(() => {
            this.location.back();
          });
      }
    });
  }
}
