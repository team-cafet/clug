import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ClubService } from 'src/app/core/services';
import { cleanObjectForSending } from 'src/app/core/functions';

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

      if (this.club.id) {
        this.club = await this.clubSrv.saveOne(cleanObjectForSending(this.club));
      } else {
        this.club = await this.clubSrv.addOne(cleanObjectForSending(this.club));
      }

      this.saved.emit(this.club);

    } catch (error) {
      console.error(error);
      this.club = backupClub;
    }
  }
}
