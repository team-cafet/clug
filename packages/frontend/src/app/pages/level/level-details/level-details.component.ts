import { Component, OnInit, ViewChild } from '@angular/core';
import { Level } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from 'src/app/core/services';
import { RestDataTableComponent } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: [ './level-details.component.scss' ]
})
export class LevelDetailsComponent implements OnInit {

  @ViewChild(RestDataTableComponent)
  private readonly restDataTableMembersComponent: RestDataTableComponent;

  level: Level;
  columnsMember = { firstname: 'Firstname', lastname: 'Lastname' };

  private readonly ID_LEVEL: number;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly levelSrv: LevelService,
    private readonly router: Router
  ) {
    this.ID_LEVEL = Number.parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  async ngOnInit(): Promise<void> {
    try {
      this.level = await this.levelSrv.getOneById(this.ID_LEVEL);
      if (!this.level) {
        throw new Error(`Level with id ${this.ID_LEVEL} Not Defined`);
      }

    } catch (error) {
      console.error(error);
    }
  }

  onRestDataTableReady() {
    this.restDataTableMembersComponent.filter(data => this.filterMemberByLevel(data));
  }

  /**
   * Filter all member passed in param by current
   * Level id
   * @param members an array of members to filter
   */
  private filterMemberByLevel(members: any[]) {
    const filteredMembers = members.filter(
      member => member.level?.id === this.ID_LEVEL
    );

    return filteredMembers;
  }
}
