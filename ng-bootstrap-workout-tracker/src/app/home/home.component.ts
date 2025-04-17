import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public stepComplete = 0;
  @ViewChild('acc') acc: any;

  nextButton(step: number) {
    this.stepComplete = step;
    this.acc.toggle(`panel${this.stepComplete + 1}`);
  }

  beforeChange($event: any) {
    if ($event.panelId == 'panel2' && this.stepComplete < 1) {
      $event.preventDefault();
    }
    if ($event.panelId == 'panel3' && this.stepComplete < 2) {
      $event.preventDefault();
    }
  }
}
