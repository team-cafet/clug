import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  membersCount: number;

  constructor(private memberSrv: MemberService) { }

  async ngOnInit(): Promise<void> {
    this.membersCount = await this.memberSrv.getStatistics();
    console.log(this.membersCount);
  }

}
