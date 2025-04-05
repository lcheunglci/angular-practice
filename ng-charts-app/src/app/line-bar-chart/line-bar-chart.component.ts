import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrl: './line-bar-chart.component.css',
})
export class LineBarChartComponent {
  chartType: ChartType = 'line';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
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
    ],
    datasets: [
      {
        data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90],
        label: 'YES',
      },
      {
        data: [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10],
        label: 'NO',
      },
    ],
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
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
    ],
    datasets: [
      {
        data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90],
        label: 'YES',
        fill: true,
        tension: 0.5,
      },
      {
        data: [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10],
        label: 'NO',
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
