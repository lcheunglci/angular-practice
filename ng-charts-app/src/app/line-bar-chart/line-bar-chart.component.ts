import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrl: './line-bar-chart.component.css',
})
export class LineBarChartComponent {
  chartType: ChartType = 'line';

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

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset1,
        label: this.label1,
      },
      {
        data: this.dataset2,
        label: this.label2,
      },
    ],
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
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

  lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: false,
  };

  chartLegend = true;

  switchChartType($event: { preventDefault: () => void }) {
    $event?.preventDefault();
    if (this.chartType === 'line') {
      this.chartType = 'bar';
    } else {
      this.chartType = 'line';
    }
  }
}
