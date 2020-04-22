import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Club,ClubService
} from 'src/app/core/core.module';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  clubs: Club[] = [];
  constructor(private clubSrv: ClubService) { }

  ngOnInit(): void {
    this.fetchClubList();
  }

  public async fetchClubList(): Promise<void>{
    return this.clubSrv.getAllClubs().then((reqClubs) => {
      this.clubs = reqClubs;
    })
    .catch((e) => {
      console.error(e);
    });
  }

}
