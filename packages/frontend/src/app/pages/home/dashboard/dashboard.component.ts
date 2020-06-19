import { Component, OnInit } from '@angular/core';
import { StatisticService } from 'src/app/core/services';
import Chart from 'chart.js'; // https://www.chartjs.org/docs/latest/getting-started/usage.html
import { Statistic } from 'src/app/core/models/statistic.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  statistics: Statistic;
  averageAge: number;

  constructor(private readonly statisticSrv: StatisticService) {}

  async ngOnInit(): Promise<void> {
    this.statistics = await this.statisticSrv.get('/');
    this.setupGraph();
  }

  getAgeFromBirthdate(birthdateString: Date): number {
    const birthdate: Date = new Date(birthdateString);
    const today: Date = new Date();

    return today.getFullYear() - birthdate.getFullYear();
  }

  private setupGraph(): void {
    const ctx = document.getElementById('membersCountChart');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const membersCountChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [ 'Membres', 'Bad payer', 'Registered this month' ],
        datasets: [
          {
            label: 'TODO',
            data: [
              this.statistics.membersCount,
              this.statistics.badPayersCount,
              this.statistics.newMembersCount
            ],
            backgroundColor: [ '#3FBF3F', '#BF3F3F', '#3FBFBF' ],
            borderColor: [ '#3FBF3F', '#BF3F3F', '#3FBFBF' ],
            borderWidth: 1,
            fill: false,
            lineTension: 0
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }


}
