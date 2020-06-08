import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/core/models';
import { MemberService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: [ './member-details.component.scss' ]
})
export class MemberDetailsComponent implements OnInit {
  ID_MEMBER = null;
  member: Member;

  constructor(
    private readonly memberSrv: MemberService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.ID_MEMBER = this.route.snapshot.paramMap.get('id');
    try {
      this.member = await this.memberSrv.getOneById(this.ID_MEMBER);

      if (!this.member) {
        throw new Error(`Member with id ${this.ID_MEMBER} Not Defined`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
