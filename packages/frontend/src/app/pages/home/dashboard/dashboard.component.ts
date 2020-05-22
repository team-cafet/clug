import { Component, OnInit } from '@angular/core';
import { MemberService, Statistics } from 'src/app/core/services';
import Chart from 'chart.js'; // https://www.chartjs.org/docs/latest/getting-started/usage.html

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  statistics: Statistics;
  averageAge: number;

  constructor(private memberSrv: MemberService) {}

  async ngOnInit(): Promise<void> {
    this.statistics = await this.memberSrv.getStatistics();
    this.averageAge = parseInt(new Date().toISOString().substring(0, 4), 10) - parseInt(this.statistics.averageAge.substring(0, 4), 10);
    this.setupGraph();
  }

  private setupGraph(): void {
    const ctx = document.getElementById('membersCountChart');
    const membersCountChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Membres', 'Mauvais payeur', 'Inscrit ce mois'],
        datasets: [
          {
            label: 'Nombre de membre',
            data: [this.statistics.membersCount, this.statistics.badPayersCount, this.statistics.newMembersCount],
            backgroundColor: [
              '#3FBF3F',
              '#BF3F3F',
              '#3FBFBF',
            ],
            borderColor: [
              '#3FBF3F',
              '#BF3F3F',
              '#3FBFBF',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
