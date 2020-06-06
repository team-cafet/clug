import { Component, OnInit, ViewChild } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from 'src/app/core/services';
import { RestDataTableComponent } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: [ './club-details.component.scss' ]
})
export class ClubDetailsComponent implements OnInit {

  @ViewChild(RestDataTableComponent)
  private readonly restDataTableMembersComponent: RestDataTableComponent;

  club: Club;
  columnsMember = { firstname: 'Firstname', lastname: 'Lastname' };

  private readonly ID_CLUB: number;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly clubSrv: ClubService
  ) {
    this.ID_CLUB = Number.parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  async ngOnInit(): Promise<void> {
    try {
      this.club = await this.clubSrv.getOneById(this.ID_CLUB);
      if (!this.club) {
        throw new Error(`Club with id ${this.ID_CLUB} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onRestDataTableReady() {
    this.restDataTableMembersComponent.filter(data => this.filterMemberByClub(data));
  }

  /**
   * Filter al member by the current club id
   * @param members an array of members to filter
   */
  private filterMemberByClub(members: any[]) {
    const filteredMembers = members.filter(
      member => member.club?.id === this.ID_CLUB
    );

    return filteredMembers;
  }
}
