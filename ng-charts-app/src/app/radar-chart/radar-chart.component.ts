import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.css',
})
export class RadarChartComponent {
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dataset1 = [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90];
  label1 = 'YES';
  dataset2 = [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10];
  label2 = 'NO';

  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset1,
        label: this.label1,
        fill: true,
        tension: 0.5,
      },
      {
        data: this.dataset2,
        label: this.label2,
        fill: true,
        tension: 0.5,
      },
    ],
  };
  radarChartOptions: ChartOptions<'radar'> = {
    responsive: false,
  };

  chartLegend = true;
}
