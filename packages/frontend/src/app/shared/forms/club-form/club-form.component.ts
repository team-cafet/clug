import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ClubService } from 'src/app/core/services';

@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: [ './club-form.component.scss' ]
})
export class ClubFormComponent {
  @Input() club: Club;
  @Output() saved = new EventEmitter<Club>();

  constructor(
    private readonly memberSrv: ClubService,
    private readonly clubSrv: ClubService
  ) {}

  async save() {
    const backupClub = this.club;
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

      if (this.club.id) {
        this.club = await this.clubSrv.saveOne(this.club);
      } else {
        this.club = await this.clubSrv.addOne(this.club);
      }

      this.saved.emit(this.club);

    } catch (error) {
      console.error(error);
      this.club = backupClub;
    }
  }
}
