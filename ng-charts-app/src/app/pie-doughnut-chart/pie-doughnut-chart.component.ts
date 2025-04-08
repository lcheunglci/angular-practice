import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-doughnut-chart',
  templateUrl: './pie-doughnut-chart.component.html',
  styleUrl: './pie-doughnut-chart.component.css',
})
export class PieDoughnutChartComponent {
  chartType: ChartType = 'pie';

  labels = ['YES', 'NO', 'N/A'];

  // dataset1 = [80, 15, 5];
  dataset1 = [350, 120, 100];
  dataset2 = [50, 150, 120];
  dataset3 = [250, 130, 70];

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset1,
      },
      {
        data: this.dataset2,
      },
      {
        data: this.dataset3,
      },
    ],
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset1,
      },
      {
        data: this.dataset2,
      },
      {
        data: this.dataset3,
      },
    ],
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
  };

  chartLegend = true;

  switchChartType($event: { preventDefault: () => void }) {
    $event?.preventDefault();
    if (this.chartType === 'pie') {
      this.chartType = 'doughnut';
    } else {
      this.chartType = 'pie';
    }
  }
}
