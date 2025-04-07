import { Component, ViewChild } from '@angular/core';
import {
  ChartConfiguration,
  ChartEvent,
  ChartOptions,
  ChartType,
  Color,
  PointElement,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrl: './line-bar-chart.component.css',
})
export class LineBarChartComponent {
  chartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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

  // Legacy way to set
  // chartColors: Color[] = [
  //   {
  //     backgroundColor: 'rbg(183, 252, 182, 0.5',
  //   },
  //   {
  //     backgroundColor: 'rgb(245, 76, 76, 0.8',
  //   },
  // ];
  // chartColors: Color[] = ['#ff6384', '#36a2eb'];
  // chartColors: Color[] = ['orange', 'green'];
  chartColors: Color[] = ['rbg(183, 252, 182, 0.5', 'rgb(245, 76, 76, 0.8'];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset1,
        label: this.label1,
        backgroundColor: this.chartColors[0],
      },
      {
        data: this.dataset2,
        label: this.label2,
        backgroundColor: this.chartColors[1],
      },
    ],
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataset2,
        label: this.label2,
        fill: true,
        tension: 0.5,
        backgroundColor: this.chartColors[1],
      },
      {
        data: this.dataset1,
        label: this.label1,
        fill: true,
        tension: 0.5,
        backgroundColor: this.chartColors[0],
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

  onChartClick($event: { event?: ChartEvent; active?: any[] }) {
    if ($event.active!.length > 0) {
      // Legacy
      // const chart = $event.active![0]._chart;
      // console.log('click', chart);
      // const activePoints = chart.getActiveElements();
      // const clickedElementIndex = activePoints[0].index;

      // const chart = $event.event;
      const chart = $event.active![0] as {
        element: PointElement;
        datasetIndex: number;
        index: number;
      };
      const clickedElementIndex = chart.index;
      const activeIndex = chart.datasetIndex;

      const label = this.lineChartData.labels![clickedElementIndex];
      const value =
        this.lineChartData.datasets[activeIndex].data[clickedElementIndex];
      const value1 = this.lineChartData.datasets[0].data[clickedElementIndex];
      const value2 = this.lineChartData.datasets[1].data[clickedElementIndex];

      // const activePoints = chart.getActiveElements();
      // console.log('click', active);

      // const label = chart.data.labels?.at(clickedElementIndex);
      // const value1 = chart.data.datasets[0].data[clickedElementIndex];
      // const value2 = chart.data.datasets[1].data[clickedElementIndex];

      console.log('active', clickedElementIndex, label, value);
      console.log('dataset 1', clickedElementIndex, label, value1);
      console.log('dataset 2', clickedElementIndex, label, value2);
    }
  }

  onChartHover($event: { event: ChartEvent; active: object[] }) {
    if ($event.active.length > 0) {
      console.log('hover', $event);
      //this.chartColors[0].pointBorderColor = 'red';
      // this.chartColors[0].borderColor = 'red';

      this.lineChartData.datasets[0].backgroundColor = 'red';
      this.lineChartData.datasets[1].pointBorderColor = 'red';
      this.chart?.update();
    }
    // else {
    //   this.lineChartData.datasets[0].backgroundColor = this.chartColors[0];
    //   this.lineChartData.datasets[1].pointBorderColor = this.chartColors[1];
    // }
  }

  colors = ['red', 'green', 'blue', 'yellow', 'purple'];
  colorIndex = 0;

  randomColor($event: MouseEvent) {
    this.lineChartData.datasets[1].backgroundColor =
      this.colors[this.colorIndex++];
    if (this.colorIndex >= this.colors.length) {
      this.colorIndex = 0;
    }
    this.chart?.update();
  }
}
