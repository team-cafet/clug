import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/core/models';
import { MemberService } from 'src/app/core/services';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  member: Member;

  constructor(private memberSrv: MemberService) {}

  async ngOnInit() {
    this.member = await this.memberSrv.getOneById(1);
  }
}
