import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { hide, show } from '../../ngrx-state/actions/home.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isShowMore: boolean = false;

  show$: Observable<boolean> = new Observable();

  constructor(private store: Store<{ home: false }>) {
    this.show$ = this.store.select('home');
  }

  showMore() {
    // this.isShowMore = true;
    this.store.dispatch(show());
  }

  showLess() {
    // this.isShowMore = false;
    this.store.dispatch(hide());
  }
}
