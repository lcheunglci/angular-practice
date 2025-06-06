import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // isShowMore: boolean = false;
  isShowMoreWithSignal = signal(false);

  showMore() {
    // this.isShowMore = true;
    this.isShowMoreWithSignal.set(true);
  }

  showLess() {
    // this.isShowMore = false;
    this.isShowMoreWithSignal.set(false);
  }
}
