import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // isShowMore: boolean = false;
  isShowMoreWithSignal = signal(false);
  clickCount = signal(0);
  clickCountComputed = computed(() => this.clickCount() * 2);

  showMore() {
    // this.isShowMore = true;
    this.isShowMoreWithSignal.set(true);

    this.clickCount.update((value) => value + 1);
  }

  showLess() {
    // this.isShowMore = false;
    this.isShowMoreWithSignal.set(false);
  }
}
