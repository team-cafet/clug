import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models/club.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  clubs: Club[] = [];
  tableDataSource = new MatTableDataSource([]);
  constructor(private clubSrv: Club) { }

  ngOnInit(): void {
  }

}
