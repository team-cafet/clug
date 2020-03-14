import { Component, OnInit } from '@angular/core';
import { Member, MemberService } from 'src/app/core/core.module';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  members: Member[];
  displayedColumns: string[] = ['name', 'surname', 'sexe', 'phone', 'financialStatus' ];

  constructor(private memberSrv: MemberService) {}

  ngOnInit(): void {
    this.memberSrv
      .getAllMember()
      .then(reqMembers => {
        this.members = reqMembers;
      })
      .catch(e => {
        console.error(e);
      });
  }
}
