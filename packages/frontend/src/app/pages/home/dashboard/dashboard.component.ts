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

  constructor(private memberSrv: MemberService) {}

  async ngOnInit(): Promise<void> {
    this.statistics = await this.memberSrv.getStatistics();
    this.setupGraph();
  }

  private setupGraph(): void {
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Membres', 'Mauvais payeur', 'Inscrits ce mois'],
        datasets: [
          {
            label: 'Nombre de membre',
            data: [70, this.statistics.badPayersCount, this.statistics.newMembersCount],
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
